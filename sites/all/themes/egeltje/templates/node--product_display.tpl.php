<?php
/**
 * @file
 * Returns the HTML for a node.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728164
 */
?>
<article class="node-<?php print $node->nid; ?> <?php print $classes; ?> clearfix"<?php print $attributes; ?>>

  <header>
    <h1><?php print $title; ?></h1>
    <?php if ($unpublished): ?>
      <mark class="unpublished"><?php print t('Unpublished'); ?></mark>
    <?php endif; ?>
  </header>


  <div class="column column-1">
    <?php print render($content['product:field_images']); ?>
  </div>
  
  <div class="column column-2">
  <?php
    hide($content['title_field']);
    hide($content['comments']);    
    print render($content['body']); 
  ?>
  
    <div class="call-to-action">
     
      <div class="price">
        <?php print render($content['product:commerce_price']); ?>
      </div>
    
      <?php if (isset($content['product:field_variation_color'][0])): ?>
        <div class="attribute-color attribute">
          <?php print render($content['product:field_variation_color']); ?>
        </div>
      <?php endif; ?>
      <?php if (isset($content['product:field_variation_shape'][0])): ?>
        <div class="attribute-shape attribute">
          <?php print render($content['product:field_variation_shape']); ?>
        </div>
      <?php endif; ?>


    
      <?php print render($content); ?>
      
    </div>
  
  </div>





  <?php print render($content['links']); ?>

</article>
