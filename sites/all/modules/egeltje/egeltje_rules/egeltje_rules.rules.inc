<?php


/**
* Implementation of hook_rules_condition_info().
*/
function egeltje_rules_rules_condition_info() {
  return array(
    'egeltje_rules_product_solden' => array(
      'group' => 'egeltje',
      'label' => t('Product is in solden'),
      'arguments' => array(
        'product' => array(
            'type' => 'commerce_product', 
            'label' => t('het product')
        ),
      ),
      'module' => 'egeltje_rules',
    ),
  );
}


/**
 * Callback function for checking if product "is in solden"
 */
function egeltje_rules_product_solden($product) {
  
  // find the product ID, so we can find the NODE ID of the product display
  $product_id = $product->product_id;
  
  // load the product display
  $result = db_query("SELECT entity_id FROM {field_data_field_product} WHERE field_product_product_id=:product_id LIMIT 0,1;", array(':product_id' => $product_id));
  foreach($result as $row) {
    $product_display_wrapper = entity_metadata_wrapper('node', $row->entity_id);
    if ($product_display_wrapper) {
      $solden_field = $product_display_wrapper->field_product_solden->value();
      if ($solden_field) {
        return TRUE;
      }
    }

  }
  
  return FALSE;
}