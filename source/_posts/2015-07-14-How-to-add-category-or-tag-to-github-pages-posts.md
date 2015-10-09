---
layout: post
comments: true
categories: [productivity]
title: How to add category or tag to github page posts
---

**[updated 2015.09.13]** This adding method is only for my project pages (gh-pages) *GitBlogs*, and for octopress, the way is builded in.

**[updated 2015.06.07]** For adding category or tag automatically through python script, go to [here](http://hongchaozhang.github.io/code/2015/06/27/instructions-for-adding-tags-and-categories.html).

### Introduction

The **index** page includes *cat_tag_for_index.html* for showing all the categories and tags, and the number of the corresponding posts.

The **_layouts/default.html** describes the content of a post, because post includes it. In the **_layout/default.html** file, it includes the **cat_tag.html** template as the *category* and *tag* info in the beginning of the post. And **cat_tag.html** also includes the date behind.

*_data/categories.yml* and *_data/tags.yml* describe all the categories and tags.

<!-- more -->

### Category

To add a **category**:

1. add the category in *_data/categories.yml*. The *slug* tag is used as the *id*, the *name* is used as the *description*, and the *color* is used as the background color.
2. in folder *blog/category/*, add a *.md* file with the category as the file name. use the following as the content (change *category_name* to the real category name):

	\-\-\-<br>
	layout: blog_by_category<br>
	cat: category_name<br>
	permalink: /blog/category/category_name/<br>
	\-\-\-<br>

Now we can use *category: category_name* in the post *YAML* header to indicate the category of the post.

**Note:** the category name can not contain capital letter. For example, *testCat* will not work as a new category.

### Tag

Adding a new **tag** is very similar to adding a new category.