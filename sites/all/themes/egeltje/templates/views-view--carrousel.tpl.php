<?php

/**
 * @file
 * Theming file for carrousel
 */

$result = $view->result;

$output = "";

foreach ($result as $row) {
  $node = $row->_field_data['nid']['entity'];
  $title_field = field_get_items('node', $node, 'field_carrousel_titel');
  $subtitle_field = field_get_items('node', $node, 'field_carrousel_ondertitel');
  $image_field = field_get_items('node', $node, 'field_carrousel_afbeelding');
  $image_url = file_create_url($image_field[0]['uri']);
  $output .= "<li class='slide'>"
    . "<div class='text'>"
    . "<div class='title'>" . strip_tags($title_field[0]['safe_value'], '<br>') . "</div>"
    . "<div class='subtitle'>" . strip_tags($subtitle_field[0]['safe_value'], '<br>') . "</div>"
    . "</div>"
    . "<div class='image'><img src='" . $image_url . "' /></div>"    
    . "</li>";
}

?>

<div class='view-carrousel'>
	<ul class="slides">
		<?php print $output; ?>
	</ul>
</div>