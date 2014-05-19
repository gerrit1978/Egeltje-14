<?php
/**
 * @file
 * Contains the theme's functions to manipulate Drupal's default markup.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728096
 */


/**
 * Override or insert variables into the maintenance page template.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("maintenance_page" in this case.)
 */
/* -- Delete this line if you want to use this function
function egeltje_preprocess_maintenance_page(&$variables, $hook) {
  // When a variable is manipulated or added in preprocess_html or
  // preprocess_page, that same work is probably needed for the maintenance page
  // as well, so we can just re-use those functions to do that work here.
  egeltje_preprocess_html($variables, $hook);
  egeltje_preprocess_page($variables, $hook);
}
// */

/**
 * Override or insert variables into the html templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("html" in this case.)
 */
/* -- Delete this line if you want to use this function
function egeltje_preprocess_html(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');

  // The body tag's classes are controlled by the $classes_array variable. To
  // remove a class from $classes_array, use array_diff().
  //$variables['classes_array'] = array_diff($variables['classes_array'], array('class-to-remove'));
}
// */

/**
 * Override or insert variables into the page templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("page" in this case.)
 */
/* -- Delete this line if you want to use this function
function egeltje_preprocess_page(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the node templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("node" in this case.)
 */
function egeltje_preprocess_node(&$variables, $hook) {

  if ($variables['type'] == 'product_display') {
    $link_go_to_product = array(
      '#prefix' => "<div class='go-to-product'>",
      '#markup' => l(t('Bekijk dit product'), 'node/' . $variables['node']->nid),
      '#suffix' => "</div>",
    );

    switch ($variables['view_mode']) {
      case 'full':
      default:
/*         dpm($variables['content']); */
        break;
      
      case 'product_in_de_kijker':
        $variables['theme_hook_suggestions'][] = 'node__product_display__front';      
        $variables['content']['link_go_to_product'] = $link_go_to_product;
        break;
      
      case 'product_catalogus':
	      $commerce_price = $variables['content']['product:commerce_price'];
	      $variables['content']['product_price'] = array(
	        '#markup' => $commerce_price[0]['#markup'],
	        '#prefix' => "<div class='product-price'>",
	        '#suffix' => "</div>",
	      );
        $variables['theme_hook_suggestions'][] = 'node__product_display__catalog';      
        $variables['content']['link_go_to_product'] = $link_go_to_product;
        break;

    }
  }
}



// */

/**
 * Override or insert variables into the comment templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("comment" in this case.)
 */
/* -- Delete this line if you want to use this function
function egeltje_preprocess_comment(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the region templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("region" in this case.)
 */
/* -- Delete this line if you want to use this function
function egeltje_preprocess_region(&$variables, $hook) {
  // Don't use Zen's region--sidebar.tpl.php template for sidebars.
  //if (strpos($variables['region'], 'sidebar_') === 0) {
  //  $variables['theme_hook_suggestions'] = array_diff($variables['theme_hook_suggestions'], array('region__sidebar'));
  //}
}
// */

/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
/* -- Delete this line if you want to use this function
function egeltje_preprocess_block(&$variables, $hook) {
  // Add a count to all the blocks in the region.
  // $variables['classes_array'][] = 'count-' . $variables['block_id'];

  // By default, Zen will use the block--no-wrapper.tpl.php for the main
  // content. This optional bit of code undoes that:
  //if ($variables['block_html_id'] == 'block-system-main') {
  //  $variables['theme_hook_suggestions'] = array_diff($variables['theme_hook_suggestions'], array('block__no_wrapper'));
  //}
}
// */

function egeltje_facetapi_link_inactive($variables) {

  // Builds accessible markup.
  $accessible_vars = array(
    'text' => $variables['text'],
    'active' => FALSE,
  );
  $accessible_markup = theme('facetapi_accessible_markup', $accessible_vars);
  // Sanitizes the link text if necessary.
  $sanitize = empty($variables['options']['html']);
  $variables['text'] = ($sanitize) ? check_plain($variables['text']) : $variables['text'];
  // Adds count to link if one was passed.
  if (isset($variables['count'])) {
    $variables['text'] .= ' ' . theme('facetapi_count', $variables);
  }
  // Add functionality requested in #1669600.
  if (!$variables['count'] && isset($variables['options']['query']['f'])) {
    // We should be getting this from the url processor plugin, however we are
    // making an assumption since this is in our custom theme.
    $params = &$variables['options']['query']['f'];
    // Capture the filter associated with this link and find the field alias.
    $filter = end($params);
    $field_alias = substr($filter, 0, strpos($filter, ':')) . ':';
    // Iterate over params and strip out items that are using the same field
    // alias as this filter. Do not strip out this filter.
    foreach ($params as $key => $param) {
      if (0 === strpos($param, $field_alias) && $param != $filter) {
        unset($params[$key]);
      }
    }
  }
  // Resets link text, sets to options to HTML since we already sanitized the
  // link text and are providing additional markup for accessibility.
  $variables['text'] .= $accessible_markup;
  $variables['options']['html'] = TRUE;
  return theme_link($variables);
}