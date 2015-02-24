<?php
/**
 * @file
 * Class RestClientException.
 */

/**
 * Class Client Exception
 * Class RestClientException
 */
class RestClientException extends Exception {
}

/**
 * Class RestClient.
 */
class RestClient {

  protected $submitted = FALSE;
  protected $headers = array();
  protected $body = '';

  /**
   * Get Url Request.
   *
   * @param string $uri
   *   Url.
   * @param array $headers
   *   Header.
   * @param int $timeout
   *   Timeout.
   *
   * @return this
   *   Class Instance.
   *
   * @throws RestClientException
   */
  public function get($uri, $headers = array(), $timeout = 30) {
    $ch = curl_init($uri);

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt(
      $ch,
      CURLOPT_SSL_VERIFYPEER,
      KANDY_SSL_VERIFY
    );
    if (is_array($headers) && count($headers) > 0) {
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    if (curl_errno($ch)) {
      throw new RestClientException(curl_errno($ch));
    }
    $this->submitted = TRUE;
    $this->body = curl_exec($ch);
    $this->headers = curl_getinfo($ch);

    curl_close($ch);
    return $this;
  }

  /**
   * Post to url.
   *
   * @param string $uri
   *   Url.
   * @param string $payload
   *   Pay load.
   * @param array $headers
   *   Header.
   * @param int $timeout
   *   Timeout.
   *
   * @return this
   *   Class Instance.
   *
   * @throws RestClientException
   */
  public function post($uri, $payload, $headers = array(), $timeout = 30) {
    $ch = curl_init($uri);

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt(
      $ch,
      CURLOPT_SSL_VERIFYPEER,
      KANDY_SSL_VERIFY
    );
    if (is_array($headers) && count($headers) > 0) {
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    if (curl_errno($ch)) {
      throw new RestClientException(curl_errno($ch));
    }

    $this->submitted = TRUE;
    $this->body = curl_exec($ch);
    $this->headers = curl_getinfo($ch);
    curl_close($ch);
    return $this;
  }

  /**
   * Put Url Request.
   *
   * @param string $uri
   *   Url.
   * @param int $payload
   *   Pay load.
   * @param array $headers
   *   Header.
   * @param int $timeout
   *   Timeout.
   *
   * @return this
   *   Class Instance.
   *
   * @throws RestClientException
   */
  public function put($uri, $payload, $headers = array(), $timeout = 30) {
    $ch = curl_init($uri);

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt(
      $ch,
      CURLOPT_SSL_VERIFYPEER,
      KANDY_SSL_VERIFY
    );
    if (is_array($headers) && count($headers) > 0) {
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    if (curl_errno($ch)) {
      throw new RestClientException(curl_errno($ch));
    }

    $this->submitted = TRUE;
    $this->body = curl_exec($ch);
    $this->headers = curl_getinfo($ch);

    curl_close($ch);
    return $this;
  }

  /**
   * Delete Url Request.
   *
   * @param string $uri
   *   Url.
   * @param array $headers
   *   Header.
   * @param int $timeout
   *   Time out.
   *
   * @return this
   *   Class Instance.
   *
   * @throws RestClientException
   */
  public function delete($uri, $headers = array(), $timeout = 30) {
    $ch = curl_init($uri);

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt(
      $ch,
      CURLOPT_SSL_VERIFYPEER,
      KANDY_SSL_VERIFY
    );
    if (is_array($headers) && count($headers) > 0) {
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    if (curl_errno($ch)) {
      throw new RestClientException(curl_errno($ch));
    }
    $this->submitted = TRUE;
    $this->body = curl_exec($ch);
    $this->headers = curl_getinfo($ch);

    curl_close($ch);
    return $this;
  }

  /**
   * After the request - functions to return data.
   *
   * @return int|string
   *   Status.
   */
  public function getStatusText() {
    if ($this->submitted) {
      return $this->getStatusCode();
    }
    return 'UNKNOWN';
  }

  /**
   * After the request - functions to return data.
   *
   * @return int|string
   *   Status Code.
   */
  public function getStatusCode() {
    if ($this->submitted) {
      return $this->getHeader('http_code');
    }
    return 0;
  }

  /**
   * After the request - functions to return data.
   *
   * @param int $index
   *   index.
   *
   * @return string
   *   Header
   */
  public function getHeader($index) {
    if (isset($this->headers[$index])) {
      return $this->headers[$index];
    }
    return 'N/A';
  }

  /**
   * Get Content.
   * @return string
   *   Content.
   */
  public function getContent() {
    return $this->body;
  }

  /**
   * Get Header.
   *
   * @return array
   *   Header.
   */
  public function getHeaders() {
    return $this->headers;
  }

  /**
   * Get Time.
   *
   * @return string
   *   Time.
   */
  public function getTime() {
    return $this->getHeader('total_time');
  }
}
