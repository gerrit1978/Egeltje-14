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

			$query = new EntityFieldQuery;
			
			$query->entityCondition('entity_type', 'node', '=')
			  ->propertyCondition('type', 'product_display')
			  ->fieldCondition('field_product', 'product_id', $commerce_product->product_id, '=')
			  ->range(0, 1);
			
			if ($result = $query->execute()) {
			  $product_display = entity_metadata_wrapper('node', key($result['node']));
			  $merk_field = $product_display->field_product_merk->value();
				if ($merk_field->name != "Kadobon") {
				  $flag = FALSE;
				}
			}
	  }
	}

  return $flag;
}