<?php

 /**
  * @file
  * Example rules module to create actions, events, and conditions
  */

/**
 * Implement hook_rules_action_info()

 * Declare any meta data about actions for Rules
 */

function campaign_monitor_subscribe_rules_action_info() {
	$actions = array(
		'campaign_monitor_subscribe_order' => array(
			  'label' => t('Subscribe user to subscriber list'),
			  'group' => t('Campaign Monitor'), 
	      'arguments' => array(
	        'order' => array(
	          'label' => t('Commerce Order'),
	          'type' => 'commerce_order',
	        ), 
	      ), 
			),
		);
	
	return $actions;
}


/**
 * Callback function for subscribing order email address to list
 */
function campaign_monitor_subscribe_order($order) {

  // does this subscriber have to be subscribed?
  $wrapper = entity_metadata_wrapper('commerce_order', $order);
  $field_newsletter = $wrapper->field_newsletter->value();

  if (is_array($field_newsletter) && (isset($field_newsletter[0])) && ($field_newsletter[0] == 1)) {
    $mail = $order->mail;
    
    // subscribe hier
	  $api_key                = variable_get('campaignmonitor_api_key', '');
	  $api_client_id          = variable_get('campaignmonitor_api_client_id', '');
	  $api_subscriber_list_id = variable_get('campaignmonitor_api_subscriber_list_id', '');
	
	  include_once(drupal_get_path('module', 'campaign_monitor_subscribe') . '/lib/csrest_subscribers.php');
	  
	  $campaign_monitor = new CS_REST_Subscribers($api_subscriber_list_id, $api_key);
	  
	  $subscriber = array(
	    'EmailAddress' => $mail,
  		'Name' => '',
		  'CustomFields' => array(),
		  'Resubscribe' => TRUE,
	  );
	  
	  $result = $campaign_monitor->add($subscriber);
	
/*
	  if ($result->http_status_code == '201') {
	    drupal_set_message(t('Email address successfully added.'));
	  } else {
		  drupal_set_message(t('Email address could not be added.'));
	  }
*/
    
  }
}