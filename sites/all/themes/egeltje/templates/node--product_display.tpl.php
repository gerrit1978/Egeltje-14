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
    // We hide the comments and links now so that we can render them later.
    hide($content['comments']);
    hide($content['links']);
    hide($content['product:title_field']);
    hide($content['title_field']);    
    hide($content['body']);
    
    print render($content);
    print render($content['body']);
  ?>
  </div>





  <?php print render($content['links']); ?>

</article>
