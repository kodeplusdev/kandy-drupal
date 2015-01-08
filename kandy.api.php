<?php
// KANDY USER FILTERING STATUS
define('KANDY_USER_ALL', 1);
define('KANDY_USER_ASSIGNED', 2);
define('KANDY_USER_UNASSIGNED', 3);


/**
 * Get Kandy User Data for assignment table
 * @return array
 */
function getKandyUserData()
{
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
        $url = url(
            '/admin/config/content/kandy/assignment/edit',
            array('query' => array('id' => $row->uid), 'absolute' => true)
        );

        $kandyUser = getAssignKandyUser($row->uid);

        $tableCell = array(
            'uid'  => $row->uid,
            'name' => $row->name,
            ($kandyUser) ? $kandyUser->user_id : null,
            array(
                'data' => array(
                    '#type'  => 'link',
                    '#title' => t('Edit'),
                    '#href'  => $url
                )
            )
        );
        //$rows[] = array('data' => (array) $row);
        $rows[] = $tableCell;
    }
    return $rows;
}


/**
 * Get domain access token
 * @return array A list of message and data
 * @throws RestClientException
 */
function getDomainAccessToken()
{
    include_once('/includes/RestClient.php');
    $kandyApiKey = variable_get('kandy_api_key', KANDY_API_KEY);
    $kandyDomainSecretKey = variable_get(
        'kandy_domain_secret_key',
        KANDY_DOMAIN_SECRET_KEY
    );
    $params = array(
        'key'               => $kandyApiKey,
        'domain_api_secret' => $kandyDomainSecretKey
    );

    $fieldsString = http_build_query($params);
    $url = KANDY_API_BASE_URL . 'domains/accesstokens' . '?'
        . $fieldsString;

    try {
        $response = (new RestClient())->get($url)->getContent();
    } catch (Exception $ex) {
        return array(
            'success' => false,
        );
    }

    $response = json_decode($response);
    if ($response->message == 'success') {
        return array(
            'success' => true,
            'data'    => $response->result->domain_access_token,
        );
    } else {
        return array(
            'success' => false,
            'message' => $response->message
        );
    }
}

/**
 * List Kandy User from database
 * @param $type
 * @param bool $remote
 * @return array
 */
function listUsers($type = KANDY_USER_ALL, $remote = false)
{
    $result = array();

    // get data from server
    if ($remote) {
        $getTokenResponse = getDomainAccessToken();
        if ($getTokenResponse['success']) {
            $domainAccessToken = $getTokenResponse['data'];
            $params = array(
                'key' => $domainAccessToken
            );

            $fieldsString = http_build_query($params);
            $url = KANDY_API_BASE_URL . 'domains/users' . '?'
                . $fieldsString;
            $headers = array(
                'Content-Type: application/json'
            );

            try {
                $response = (new RestClient())->get($url, $headers)->getContent();
            } catch (Exception $ex) {
                return array(
                    'success' => false,
                    'message' => $ex->getMessage()
                );
            }
            $response = json_decode($response);

            if ($response) {
                $data = $response->result;
                $result = $data->users;
            }
        }
    } else {
        $getDomainNameResponse = getDomain();
        if($getDomainNameResponse['success']){
            $domainName = $getDomainNameResponse['data'];
            if ($type == KANDY_USER_ALL) {
                $query = db_select('kandy_users')
                    ->fields('kandy_users')
                    ->condition('domain_name', $domainName, '=');

            } else {
                if ($type == KANDY_USER_ASSIGNED) {
                    $query = db_select('kandy_users')
                                    ->fields('kandy_users')
                                    ->isNotNull('main_user_id')
                                    ->condition('domain_name', $domainName, '=');
                } else {
                    if ($type == KANDY_USER_UNASSIGNED) {
                        $query = db_select('kandy_users')
                            ->fields('kandy_users')
                            ->isNull('main_user_id')
                            ->condition('domain_name', $domainName, '=');
                    }
                }
            }
            $queryData = $query->execute();
            foreach ($queryData as $record) {
                $result[] = $record;
            }
        }

    }

    return $result;
}

/**
 * get Assigned Kandy User By main_user_id
 * @param $mainUserId
 * @return mixed
 */
function getAssignKandyUser($mainUserId)
{
    $result = null;
    $getDomainNameResponse = getDomain();

    if ($getDomainNameResponse['success']) {
        $domainName = $getDomainNameResponse['data'];
        $query = db_select('kandy_users')
            ->fields('kandy_users')
            ->condition('main_user_id', $mainUserId, '=')
            ->condition('domain_name', $domainName, '=');
        $queryData = $query->execute();
        $result = $queryData->fetchObject();
    }

    return $result;
}

/**
 * get kandy user by user_id
 * @param $userId
 * @return mixed
 */
function getKandyUserByUserId($userId){
    $result = null;
    $getDomainNameResponse = getDomain();

    if ($getDomainNameResponse['success']) {
        $domainName = $getDomainNameResponse['data'];
        $query = db_select('kandy_users')
                ->fields('kandy_users')
                ->condition('user_id', $userId, '=')
                ->condition('domain_name', $domainName, '=');
        $queryData = $query->execute();
        $result = $queryData->fetchObject();
    }

    return $result;
}
/**
 * Get the domain from domain key in the configuration
 *
 * @return array A list of message the data
 * @throws RestClientException
 */
function getDomain()
{
    $params = array(
        'key'               => KANDY_API_KEY,
        'domain_api_secret' => KANDY_DOMAIN_SECRET_KEY
    );

    $fieldsString = http_build_query($params);
    $url = KANDY_API_BASE_URL . 'domains/details' . '?'
        . $fieldsString;

    include_once('/includes/RestClient.php');
    try {
        $response = (new RestClient())->get($url)->getContent();
    } catch (Exception $ex) {
        return array(
            'success' => false,
            'message' => $ex->getMessage()
        );
    }

    $response = json_decode($response);
    if ($response->message == 'success') {
        return array(
            'success' => true,
            'data'    => $response->result->domain->domain_name,
        );
    } else {
        return array(
            'success' => false,
            'message' => $response->message
        );
    }
}
/**
 * Get all users from Kandy and import/update to kandy_user
 *
 * @return array A json status and message
 */
function syncUsers()
{
    $kandyUsers = listUsers(KANDY_USER_ALL, true);
    $getDomainNameResponse = getDomain();

    if ($getDomainNameResponse['success']) {
        $domainName = $getDomainNameResponse['data'];

        // The transaction opens here.
        $transaction = db_transaction();
        $receivedUsers = array();
        try {
            foreach($kandyUsers as $kandyUser){
                $receivedUsers[] = $kandyUser->user_id;
                $fields = array(
                    'user_id',
                    'first_name',
                    'last_name',
                    'password',
                    'email',
                    'domain_name',
                    'api_key',
                    'api_secret',
                    'updated_at'
                );

                $dataValues = array(
                    'user_id' => $kandyUser->user_id,
                    'first_name' => $kandyUser->user_first_name,
                    'last_name' => $kandyUser->user_last_name,
                    'password' => $kandyUser->user_password,
                    'email' => $kandyUser->user_email,
                    'domain_name' => $kandyUser->domain_name,
                    'api_key' => $kandyUser->user_api_key,
                    'api_secret' => $kandyUser->user_api_secret,
                    'updated_at' => date("Y-m-d H:i:s"),
                );
                $kandyUserModel = getKandyUserByUserId($kandyUser->user_id);

                if(!$kandyUserModel){
                    // insert
                    $fields[] = 'created_at';
                    $dataValues['created_at'] = date("Y-m-d H:i:s");
                    $query = db_insert('kandy_users')
                        ->fields($fields)
                        ->values($dataValues);

                } else {
                    //update
                    $query = db_update('kandy_users')
                        ->fields($dataValues)
                        ->condition('user_id', $kandyUser->user_id, '=')
                        ->condition('domain_name', $domainName, '=');

                }

                $rowEffect = $query->execute();
            }//end foreach

            db_delete("kandy_users")
                    ->condition('domain_name', $domainName, '=')
                    ->condition('user_id', $receivedUsers,'NOT IN')
                    ->execute();
            $result = array(
                'success' => true,
                'message' => "Sync successfully"
            );
        }
        catch (Exception $e) {
            $transaction->rollback();

        }

    } else {
        $result = array(
            'success' => false,
            'message' => "Cannot get domain name."
        );
    }
    return $result;
}

/**
 * Assign Kandy User
 * @param $userId
 * @param $mainUserId
 * @return bool
 */
function assignKandyUser($userId, $mainUserId){
    try{
        $getDomainNameResponse = getDomain();
        if ($getDomainNameResponse['success'] == true) {
            $domainName = $getDomainNameResponse['data'];

            $num_updated = db_update('kandy_users')
                ->fields(
                    array(
                        'main_user_id' => NULL,
                    )
                )
                ->condition('main_user_id', $mainUserId, '=')
                ->condition('domain_name', $domainName, '=')
                ->execute();

            $num_updated = db_update('kandy_users')
                ->fields(
                    array(
                        'main_user_id' => $mainUserId,
                    )
                )
                ->condition('user_id', $userId, '=')
                ->condition('domain_name', $domainName, '=')
                ->execute();
            return true;
        } else {
            return false;
        }

    } catch(Exception $ex){
        return false;
    }

}

/**
 * Unassign kandy user
 * @param $mainUserId
 * @return bool
 */
function unassignKandyUser($mainUserId){
    try{
        $getDomainNameResponse = getDomain();
        if ($getDomainNameResponse['success'] == true) {
            $domainName = $getDomainNameResponse['data'];
            $num_updated = db_update('kandy_users')
                ->fields(
                    array(
                        'main_user_id' => NULL,
                    )
                )
            ->condition('main_user_id', $mainUserId, '=')
            ->condition('domain_name', $domainName, '=')
            ->execute();
        return true;
        } else {
            return false;
        }
    } catch(Exception $ex){
        return false;
    }

}

