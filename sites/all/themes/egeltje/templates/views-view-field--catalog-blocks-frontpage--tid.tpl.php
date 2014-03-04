<?php
$term = $row->_field_data['tid']['entity'];

$category = $term->name;
$category_url = url('product_category/' . $term->tid);
$color_dark_field = field_get_items('taxonomy_term', $term, 'field_catalog_color_light');
$color = $color_dark_field[0]['rgb'];

?>
<a href="<?php print $category_url; ?>" style="background-color:<?php print $color; ?>;">
<div class='category'><?php print $category; ?></div>
</a>