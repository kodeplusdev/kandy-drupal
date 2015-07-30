<?php

/**
 * @file
 * KANDY USER FILTERING STATUS.
 *
 * @package : kandy
 *
 * @subpackage : kandy
 */

define('KANDY_USER_ALL', 1);
define('KANDY_USER_ASSIGNED', 2);
define('KANDY_USER_UNASSIGNED', 3);

/**
 * Kandy get user data.
 */
function kandy_get_user_data() {
  // We are extending the PagerDefault class here.
  // It has a default of 10 rows per page.
  // The extend('PagerDefault') part here does all the magic.
  $query = db_select('users', 'u')->extend('PagerDefault');
  $query->fields('u', array('uid', 'name'));

  // Change the number of rows with the limit() call.
  $result = $query
    ->limit(10)
    ->orderBy('u.uid')
    ->execute();

  $rows = array();
  foreach ($result as $row) {
    if (empty($row->name)) {
      continue;
    }

    $url = url("/admin/config/content/kandy/assignment/edit/{$row->uid}");

    $kandy_user = kandy_get_assign_user($row->uid);

    $table_cell = array(
      'uid' => $row->uid,
      'name' => filter_xss($row->name),
      'kandyUser' => ($kandy_user) ? $kandy_user->user_id : NULL,
      'link' => array(
        'data' => array(
          '#type' => 'link',
          '#title' => t('Edit'),
          '#href' => $url,
        ),
      ),
    );

    $rows[] = $table_cell;
  }
  return $rows;
}


/**
 * Get domain access token.
 */
function kandy_get_domain_access_token() {
  $kandy_api_key = variable_get('kandy_api_key', KANDY_API_KEY);
  $kandy_domain_secret_key = variable_get(
    'kandy_domain_secret_key',
    KANDY_DOMAIN_SECRET_KEY
  );
  $params = array(
    'key' => $kandy_api_key,
    'domain_api_secret' => $kandy_domain_secret_key,
  );

  $fields_string = drupal_http_build_query($params);
  $url = KANDY_API_BASE_URL . 'domains/accesstokens?' . $fields_string;

  try {
    $response = drupal_http_request($url);
  }
  catch (Exception $ex) {
    watchdog_exception('kandy ', $ex);
    return array(
      'success' => FALSE,
      'message' => $ex->getMessage(),
      'data' => '',
    );
  }

  $response = json_decode($response->data);
  if (isset($response->message) && ($response->message == 'success')) {
    return array(
      'success' => TRUE,
      'message' => '',
      'data' => $response->result->domain_access_token,
    );
  }
  else {
    if (isset($response->message)) {
      $error_message = $response->message;
    }
    else {
      $error_message = 'Invalid Request Url';
    }
    return array(
      'success' => FALSE,
      'message' => $error_message,
      'data' => '',
    );
  }
}

/**
 * List Kandy User from database.
 */
function kandy_list_users($type = KANDY_USER_ALL, $remote = FALSE) {
  $result = array();

  // Get data from server.
  if ($remote) {
    $get_token_response = kandy_get_domain_access_token();
    if ($get_token_response['success']) {
      $domain_access_token = $get_token_response['data'];
      $params = array(
        'key' => $domain_access_token,
      );

      $fields_string = drupal_http_build_query($params);
      $url = KANDY_API_BASE_URL . 'domains/users?' . $fields_string;

      try {
        $response = drupal_http_request($url);

      }
      catch (Exception $ex) {
        watchdog_exception('kandy ', $ex);
        return array(
          'success' => FALSE,
          'message' => $ex->getMessage(),
        );
      }
      $response = json_decode($response->data);

      if ($response && isset($response->result)) {
        $data = $response->result;
        $result = $data->users;
      }
    }
  }
  else {
    $get_domain_name_response = kandy_get_domain();
    if ($get_domain_name_response['success']) {
      $domain_name = $get_domain_name_response['data'];
      if ($type == KANDY_USER_ALL) {
        $query = db_select('kandy_users')
          ->fields('kandy_users')
          ->condition('domain_name', $domain_name, '=');

      }
      else {
        if ($type == KANDY_USER_ASSIGNED) {
          $query = db_select('kandy_users')
            ->fields('kandy_users')
            ->isNotNull('main_user_id')
            ->condition('domain_name', $domain_name, '=');
        }
        else {
          if ($type == KANDY_USER_UNASSIGNED) {
            $query = db_select('kandy_users')
              ->fields('kandy_users')
              ->isNull('main_user_id')
              ->condition('domain_name', $domain_name, '=');
          }
        }
      }
      $query_data = $query->execute();
      $result = $query_data->fetchAll();
    }

  }

  return $result;
}

/**
 * Get Assigned Kandy User By main_user_id.
 *
 * @param int $main_user_id
 *   Main User Id.
 *
 * @return null
 *   Kandy User Object.
 */
function kandy_get_assign_user($main_user_id) {
  $result = NULL;
  $get_domain_name_response = kandy_get_domain();

  if ($get_domain_name_response['success']) {
    $domain_name = $get_domain_name_response['data'];
    $query = db_select('kandy_users')
      ->fields('kandy_users')
      ->condition('main_user_id', $main_user_id, '=')
      ->condition('domain_name', $domain_name, '=');
    $query_data = $query->execute();
    $result = $query_data->fetchObject();
  }

  return $result;
}

/**
 * Get kandy user by kandy user_id.
 */
function kandy_get_user_by_user_id($kandy_user_id) {
  $result = NULL;
  $get_domain_name_response = kandy_get_domain();

  if ($get_domain_name_response['success']) {
    $domain_name = $get_domain_name_response['data'];
    $query = db_select('kandy_users')
      ->fields('kandy_users')
      ->condition('user_id', $kandy_user_id, '=')
      ->condition('domain_name', $domain_name, '=');
    $query_data = $query->execute();
    $result = $query_data->fetchObject();
  }

  return $result;
}

/**
 * Get kandy user by kandy user_id.
 */
function kandy_get_user_by_user_mail($kandy_user_mail) {
  $result = NULL;
  $get_domain_name_response = kandy_get_domain();

  if ($get_domain_name_response['success']) {
    $domain_name = $get_domain_name_response['data'];

    $parse_result = explode('@', $kandy_user_mail);
    $user_id = '';
    if (!empty($parse_result[0])) {
      $user_id = $parse_result[0];
    }

    $query = db_select('kandy_users')
      ->fields('kandy_users')
      ->condition('user_id', $user_id, '=')
      ->condition('domain_name', $domain_name, '=');
    $query_data = $query->execute();

    $query_result = $query_data->fetchObject();
    if ($query_result) {
      if (!empty($query_result->main_user_id)) {
        $result = user_load($query_result->main_user_id);
      }
      else {
        $result = KANDY_UN_ASSIGN_USER;
      }
    }
  }

  return $result;
}

/**
 * Get the domain from domain key in the configuration or remote server.
 *
 * @return array
 *   Kandy domain data.
 */
function kandy_get_domain() {
  $domain_name = variable_get('kandy_domain_name', KANDY_DOMAIN_NAME);
  if (!empty($domain_name)) {
    return array(
      'success' => TRUE,
      'data' => $domain_name,
    );
  }

  $kandy_domain_api_key = variable_get(
    'kandy_api_key',
    KANDY_API_KEY
  );

  $get_token_response = kandy_get_domain_access_token();
  if ($get_token_response['success']) {
    $domain_access_token = $get_token_response['data'];
    $params = array(
      'key' => $domain_access_token,
      'domain_api_key' => $kandy_domain_api_key,
    );
    $fields_string = drupal_http_build_query($params);
    $url = KANDY_API_BASE_URL . 'accounts/domains/details?' . $fields_string;

    try {
      $request = drupal_http_request($url);

    }
    catch (Exception $ex) {
      watchdog_exception('kandy ', $ex);
      return array(
        'success' => FALSE,
        'data' => '',
        'message' => $ex->getMessage(),
      );
    }

    $response = json_decode($request->data);
    if (isset($response->message) && ($response->message == 'success')) {
      variable_set('kandy_domain_name', $response->result->domain->domain_name);
      return array(
        'success' => TRUE,
        'data' => $response->result->domain->domain_name,
        'message' => '',
      );
    }
    else {
      return array(
        'success' => FALSE,
        'data' => '',
        'message' => $response->message,
      );
    }
  }
  else {
    return array(
      'success' => FALSE,
      'data' => '',
      'message' => 'Invalid domain request',
    );
  }

}

/**
 * Get all users from Kandy and import/update to kandy_user.
 *
 * @return array
 *   A json status and message
 */
function kandy_sync_users() {
  $kandy_users = kandy_list_users(KANDY_USER_ALL, TRUE);
  $get_domain_name_response = kandy_get_domain();

  if ($get_domain_name_response['success']) {
    $domain_name = $get_domain_name_response['data'];

    // The transaction opens here.
    $transaction = db_transaction();
    $received_users = array();
    try {
      foreach ($kandy_users as $kandy_user) {
        $received_users[] = $kandy_user->user_id;
        $fields = array(
          'user_id',
          'first_name',
          'last_name',
          'password',
          'email',
          'domain_name',
          'api_key',
          'api_secret',
          'updated_at',
        );

        $data_values = array(
          'user_id' => $kandy_user->user_id,
          'first_name' => $kandy_user->user_first_name,
          'last_name' => $kandy_user->user_last_name,
          'password' => $kandy_user->user_password,
          'email' => $kandy_user->user_email,
          'domain_name' => $kandy_user->domain_name,
          'api_key' => $kandy_user->user_api_key,
          'api_secret' => $kandy_user->user_api_secret,
          'updated_at' => date("Y-m-d H:i:s"),
        );
        $kandy_user_model = kandy_get_user_by_user_id($kandy_user->user_id);

        if (!$kandy_user_model) {
          // insert.
          $fields[] = 'created_at';
          $data_values['created_at'] = date("Y-m-d H:i:s");
          $query = db_insert('kandy_users')
            ->fields($fields)
            ->values($data_values);
        }
        else {
          // update.
          $query = db_update('kandy_users')
            ->fields($data_values)
            ->condition('user_id', $kandy_user->user_id, '=')
            ->condition('domain_name', $domain_name, '=');

        }

        $query->execute();
      }
      // End foreach.
      db_delete("kandy_users")
        ->condition('domain_name', $domain_name, '=')
        ->condition('user_id', $received_users, 'NOT IN')
        ->execute();
      $result = array(
        'success' => TRUE,
        'message' => "Sync successfully",
      );
    }
    catch (Exception $ex) {
      $transaction->rollback();
      watchdog_exception('kandy ', $ex);
      $result = array(
        'success' => FALSE,
        'message' => "Error Data",
      );
    }

  }
  else {
    $result = array(
      'success' => FALSE,
      'message' => "Cannot get domain name.",
    );
  }
  return $result;
}

/**
 * Assign Kandy User.
 *
 * @param int $kandy_user_id
 *   Kandy User Id.
 * @param int $main_user_id
 *   Main User Id.
 *
 * @return bool
 *   True or False
 */
function kandy_assign_user($kandy_user_id, $main_user_id) {
  try {
    $get_domain_name_response = kandy_get_domain();
    if ($get_domain_name_response['success'] == TRUE) {
      $domain_name = $get_domain_name_response['data'];

      db_update('kandy_users')
        ->fields(
          array(
            'main_user_id' => NULL,
          )
        )
        ->condition('main_user_id', $main_user_id, '=')
        ->condition('domain_name', $domain_name, '=')
        ->execute();

      db_update('kandy_users')
        ->fields(
          array(
            'main_user_id' => $main_user_id,
          )
        )
        ->condition('user_id', $kandy_user_id, '=')
        ->condition('domain_name', $domain_name, '=')
        ->execute();
      return TRUE;
    }
    else {
      return FALSE;
    }

  }
  catch (Exception $ex) {
    watchdog_exception('kandy ', $ex);
    return FALSE;
  }

}

/**
 * Unassign kandy user.
 *
 * @param int $main_user_id
 *   Main User Id.
 *
 * @return bool
 *   True / False
 */
function kandy_unassign_user($main_user_id) {
  try {
    $get_domain_name_response = kandy_get_domain();
    if ($get_domain_name_response['success'] == TRUE) {
      $domain_name = $get_domain_name_response['data'];
      db_update('kandy_users')
        ->fields(
          array(
            'main_user_id' => NULL,
          )
        )
        ->condition('main_user_id', $main_user_id, '=')
        ->condition('domain_name', $domain_name, '=')
        ->execute();
      return TRUE;
    }
    else {
      return FALSE;
    }
  }
  catch (Exception $ex) {
    watchdog_exception('kandy ', $ex);
    return FALSE;
  }

}

/**
 * Kandy Logout.
 *
 * @return array
 *   Logout Result
 */
function kandy_logout() {
  $just_logout_user_id = FALSE;
  if (isset($_COOKIE['Drupal_visitor_kandy_user_logout'])) {
    $just_logout_user_id = $_COOKIE['Drupal_visitor_kandy_user_logout'];
  }

  $module_path = drupal_get_path('module', 'kandy');
  if (module_exists('kandy') && $just_logout_user_id) {
    $assign_user = kandy_get_assign_user($just_logout_user_id);
    if ($assign_user) {
      $user_name = $assign_user->user_id;
      $password = $assign_user->password;
      $kandy_api_key = variable_get('kandy_api_key', KANDY_API_KEY);
      if (variable_get('kandy_jquery_reload', 1)) {
        drupal_add_js(KANDY_JQUERY);
      }
      drupal_add_js(variable_get('kandy_js_url', KANDY_JS_URL));

      drupal_add_js(
          array(
              'loginInfo' => array(
                'apiKey'    => $kandy_api_key,
                'username'  => $user_name,
                'password'  => $password
              )
          ),
          'setting'
      );

      drupal_add_js($module_path . '/js/kandyDrupal.js');
      drupal_add_css($module_path . '/css/kandyDrupal.css', array(
          'group' => 'kandy',
          'weight' => 1,
        ));
      $result = array("success" => TRUE, "message" => '');
    }
    else {
      $result = array(
        "success" => FALSE,
        "message" => 'Can not found kandy user',
      );
    }

  }
  else {
    $result = array(
      "success" => FALSE,
      "message" => 'Can not found kandy module',
    );
  }

  user_cookie_delete('kandy_user_logout');
  return $result;
}

/**
 * Kandy publish assets.
 */
function kandy_publish_assets() {
  $public_path = "public://kandy";

  if (!file_exists($public_path)) {
    mkdir($public_path);
  }
  $asset_types = array("css", "js");
  $module_path = drupal_get_path('module', 'kandy');
  foreach ($asset_types as $asset_type) {
    $module_assets_path = $module_path . DIRECTORY_SEPARATOR .
      $asset_type . DIRECTORY_SEPARATOR . "shortcode";

    $module_css_asset_files = scandir($module_assets_path);

    foreach ($module_css_asset_files as $file_name) {
      if ($file_name == "." || $file_name == "..") {
        continue;
      }
      $kandy_public_folder_path = $public_path .
        DIRECTORY_SEPARATOR . $asset_type;

      if (!file_exists($kandy_public_folder_path)) {
        mkdir($kandy_public_folder_path);
      }

      $kandy_public_file_path = $kandy_public_folder_path .
        DIRECTORY_SEPARATOR . $file_name;

      $kandy_module_file_path = $module_assets_path .
        DIRECTORY_SEPARATOR . $file_name;

      if (!file_exists($kandy_public_file_path)) {
        copy($kandy_module_file_path, $kandy_public_file_path);
      }
    }
  }

}
