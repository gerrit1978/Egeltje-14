<?php


/**
 * Implements hook_rules_condition_info
 */
function egeltje_kadobon_rules_condition_info() {
  return array(
    'egeltje_kadobon_order_contains_only_products' => array(
      'label' => t('Order contains only Kadobons'), 
      'arguments' => array(
        'order' => array(
          'label' => t('Commerce Order'),
          'type' => 'commerce_order',
        ), 
      ), 
      'group' => t('Commerce Shipping'),
    ),
  );
} 



/** 
 * Callback
 */
function egeltje_kadobon_order_contains_only_products($order) {
  $flag = TRUE;
  
  
  $wrapper = entity_metadata_wrapper('commerce_order', $order);
	$line_items = $wrapper->commerce_line_items->value();
	foreach ($line_items as $line_item) {
	  if ($line_item->type == 'product') {
	    $commerce_product_field = field_get_items('commerce_line_item', $line_item, 'commerce_product');
			$commerce_product = commerce_product_load($commerce_product_field[0]['product_id']);
			$merk_field = field_get_items('commerce_product', $commerce_product, 'field_product_merk');
			if ($merk_field[0]['value'] != "kado") {
			  $flag = FALSE;
			}
	  }
	}

  return $flag;
}