---
layout: post
comments: true
categories: [productivity]
title: How to write post in github pages
---

**Contents:**

* [To add a new post](#to_add_a_new_post)
* [To add a new "category" or "tag"](#to_add_category_and_tag)
* [To enable code highlight](#to_enable_code_highlight)
* [To make the post searchable by Google](#to_make_the_post_searchable_by_google)
* [Some tips for markdown grammar](#some_tips_for_markdown_grammar)

The first two sections are only for my project pages (gh-pages) *GitBlogs*, and currently in cotopress blog, we have other new simpler ways to do these things. See [Migrate Blog to Octopress](http://hongchaozhang.github.io/blog/2015/09/09/migrate-blog-to-octopress/).

## Description
This post is **not** for how to deploy the environment of writing posts in github pages, **but** how to use the environment you deployed before.

<!-- more -->

Assuming that you have deployed the following tools:

In Local:

* Jekyll
* Git
* MarkdownPad

In Remote:

* github repo

## <a name="to_add_a_new_post"></a>To add a new post

1. git clone *https://github.com/hongchaozhang/GitBlogs.git*
2. go to *gh-pages* branch
3. open **_post** folder, add a new md file named like this: *2015-05-20-How-to-write-post-in-github-pages.md*. Notice: **DO NOT** leave any space in the file title.
4. use **MarkdownPad** in windows or **Macdown** in mac to open the md file you created, and put the yaml title on the top as follows (Note: three dashes at the top and bottom):

    \-\-\-<br>
    layout: default<br>
    comments: true<br>
    category: choose only one from /_data/categories.yml<br>
    tags: [tag1, tag2, ..., tagn] choose from /_data/tags.yml<br>
    title: How to write post in github pages<br>
    \-\-\-<br>
If you don't have a local MarkdownPad, you can use online tools to edit the md file, like [**stackedit**](https://stackedit.io/), a very powerful one. Five star recommended O(∩_∩)O~！

5. Add the content of the post. For Markdown grammar, refer [here](http://wowubuntu.com/markdown/) for Chinese version.
6. After complete the md file, you can directly push the md file to github repo, if you believe it has nothing wrong. 

For an alternative, you can using your local Jekyll to start a server and test the post you wrote. To do this:

1. Open cmd window.
2. Go to you post foler, for me, it is GitBlogs.
3. Start Jekyll server by running: *jekyll serve*
4. Open server address listed in cmd window, for me, it is *localhost:4000/GitBlogs*

## <a name="to_add_category_and_tag"></a>To add a new "category" or "tag"

If we want to add a new tag "java" into our blog, we should:

1. go to /blog/tag/ folder, and add a new file named "java.md";
2. add the following content into the new file:

	\-\-\-<br>
	layout: blog_by_tag<br>
	tag: java<br>
	permalink: /blog/tag/java/<br>
	\-\-\-<br>
3. go to /_data/ folder, and open tags.yml;
4. add the following content into tags.yml file (**NOTE** the indent and spaces):
	
	\- slug: java<br>
	name: java<br> 

For "category", it is similar.

## <a name="to_enable_code_highlight"></a>To enable code highlihgt

[official site](https://thedereck.github.io/gh-pages-blog/user-manual/syntax-highlighting.html)

[Improve Code Highlighting in a Jekyll-based Blog Site](https://demisx.github.io/jekyll/2014/01/13/improve-code-highlighting-in-jekyll.html)

* Add [syntax highlighter CSS file](https://github.com/hongchaozhang/GitBlogs/blob/gh-pages/css/syntax.css) as *css/syntax.css* to your site
* Load CSS inside of a corresponding layout file (e.g. *_layouts/default.html*)
{% highlight html linenos %}
<head>
...
<link href="/css/syntax.css" rel="stylesheet">
...
</head>
{% endhighlight %}
* Wrap your code snippets in posts with `{\% highlight objc linenos \%}` and `{\% endhighlight \%}` Liquid tags, Jekyll will (via Pygments highlighter) output color highlighted code based on chosen language scheme (e.g. objc in my case).

There is a problem here: when you select code, the line numbers are also selected. There are two ways to solve this:

* add `linenos=table` instead of `linenos` in the directive `{\% highlight objc linenos \%}`. The table may look ugly.
* Add the following javascript code into your site (depending on jQuery):

{% highlight javascript linenos %}
// hide line numbers in code pieces right before we copy the code
$(document).ready(function () {
	$("code").bind("copy", function () {
	    var innerHtml = this.innerHTML;
	    $(this).find('.lineno').remove();
	    var that = this;
	    setTimeout(function(){
	        $(that).children().remove();
	        that.innerHTML = innerHtml;
	    },0);
	});
});
{% endhighlight %}
	
## <a name="to_make_the_post_searchable_by_google"></a>To make the post searchable by Google

Refer [here](http://www.reddit.com/r/web_design/comments/2qq4me/does_google_index_github_pages/).

Google crawls and ranks websites partially based on links to it from other websites. You should consider submitting it to some award websites, show-and-tells, etc to increase the value of the domain.

It can take a few days to a few months to be indexed, depending on several factors. It's recommended that you use the [submit URL](https://www.google.com/webmasters/tools/submit-url) tool, which may help speed up this process.

I tried the [submit URL](https://www.google.com/webmasters/tools/submit-url) tool, and after hald day, my blogs can be searched in google. But you should use exactly the same words in your post to search, or your post may be very behind, as the value of your domain is very low.

## <a name="some_tips_for_markdown_grammar"></a>Some tips for markdown grammar

### insert an image

To insert the image, just use the path under the base url, for me, it is */GitBlogs/images/<image_name>.png*, for example

	![image annotation](/GitBlogs/images/001_ios_frameworks.png)
	
[**updated 2015.09.13**] The above is for my project pages (gh-pages) *GitBlogs*, and for octopress, the base url is `/`, and only `images/<image_name>.png` is needed.