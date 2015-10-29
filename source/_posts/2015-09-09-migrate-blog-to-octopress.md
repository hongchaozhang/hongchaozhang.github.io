---
layout: post
title: "Migrate blog to Octopress"
date: 2015-09-09 10:22:17 +0800
comments: true
categories: [productivity]
---

For basic configuration of octopress blog, go to [official site](http://octopress.org/) for references.

After updating OS to EI Caption (10.11), there is some bugs when we run `rake preview`. You need to update your ruby version, and reinstall dependencies of octopress. Refer to [this](http://schalkneethling.github.io/blog/2015/10/16/errno-enoent-no-such-file-or-directory-jekyll-octopress-el-capitan/) post for more details.


## Themes
Go to [here](https://github.com/imathis/octopress/wiki/3rd-Party-Octopress-Themes) to choose the theme you like. Personally, I like the **boldandblue** theme. It is simple and elegant.

<!-- more -->

## Category list
Go to [here](https://github.com/ctdk/octopress-category-list), and the guy tells you how to enhance your blog to display the categories.

## code syntax highlight
Refer to my previous post on write post for project pages (gh-pages) [How to Write Post in Github Pages](http://hongchaozhang.github.io/blog/2015/05/20/How-to-write-post-in-github-pages/#to_enable_code_highlight)

## Write post

* go to *source* branch.
* in *hongchaozhang.github.io* folder, run `rake new_post["title"]`, and you will find a well named file with `md` as the extension. Open it and edit.

> **Note:**The url of post is generated from the post file name in *_post* folder, and you shouuld only use English charactors there. But inside your site, the title comes from the `title` property in the *yaml* header of your post, and other languages are supported here.
> 
> use `published: false` in the yaml header to disable your post from being displayed in the blog.

* run `rake setup_github_pages` if you haven't run it.

> This command help you do the followings:
> 
* Ask for and store your Github Pages repository url.
* Rename the remote pointing to imathis/octopress from 'origin' to 'octopress'
* Add your Github Pages repository as the default origin remote.
* Switch the active branch from master to source.
* Configure your blog's url according to your repository.
* Setup a master branch in the _deploy directory for deployment.
* run `rake generate` to generate your new post.
* run `rake preview` to start local server at *localhost:4000* for testing.

* If everything is OK, run `rake deploy` to push the generated site in *_deploy* to **master** branch in github (Do it in **source** branch). In a second, you will see the changes at <username>.github.io.
	
> If you meet with the following error while pushing your site to master branch:
>
~~~
To git@github.com:hongchaozhang/hongchaozhang.github.io.git
! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to 'git@github.com:hongchaozhang/hongchaozhang.github.io.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
~~~
>
Go to *_deploy* folder, and run the following commands ([reference](http://stackoverflow.com/questions/21356212/failed-to-deploy-to-github-pages-using-octopress)):
>
~~~
git config branch.master.remote origin
git config branch.master.merge refs/heads/master
git pull
~~~

* push your source code to **source** branch.

> **Note:** Never push your source code to **master** branch. **master** branch should only hold your site.
	
	
	
	
	