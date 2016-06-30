---
layout: post
comments: true
categories: [productivity]
title: Basic Git Commands
---

# Contents

* [Check Current Status](#check_status)
* [Branch Operation](#branch_operation)
* [Check commit history](#check_commit_history)
* [.gitignore](#git_ignore)
* [Using *git stash*](#git_stash)
* [Use *kdiff3* as the default tool for git](#kdiff3)

<!-- more -->

**Git** commands can be searched everywheere. Here I will list only the commonly used ones in **my** development.

First of all, try the following commands first:

* **git help:** get git basic commands.

* **git help COMMAND:** get help of a command.

## <a name="check_status"></a>Check Current Status

### origin
Use 'git config --get remote.origin.url' to get current origin address.

## <a name="branch_operation"></a>Branch Operation

To checkout a new branch from remote repo: When you want to change to a branch that is not in your local side, use `git branch -a` to list all the branches, and find the one you want to checkout in the remote. Then run `git checkout --track origin/<branch_name>`, and you will get the branch. Use `git branch` to check it.

## <a name="check_commit_history"></a>Check commit history

#### search
First, use `git log` to find the commit we want. We can use `git log --author=<someone>` to narrow the scope.

Then, use **git diff COMMIT^ COMMIT** to get all the changes of one commit.

More useful commands on `git log`

git commands| in GUI *SourceTree* | comments
---|---|---
`git log --author=<someone>` | on the top left, select *Search* view | list all commits *someone* made
`git log --name-only` | on the top left, select *Log* view |  list all commits and each modified or new created files
`git log -- <file>` | right click a file and select *log selected...* | list all commits on a file
`git log -g --grep=<key words>` | on the top left, select *Search* view |  find the commits which contains the *key words* in the commit messages. **Note:**use double quotes for key words with blank spaces.

## <a name="git_ignore"></a>.gitignore

Sometimes we want to ignore some files/folders from being tracked by git. We can use **.gitignore** file to do this. But this only works for the untracked items. If you have done *git add file* to the file once, .gitignore will not exclude this file from being tracked. For this case, we can use the following two ways to ignore the file:

##### `git rm \-\-cached file`

This command will remove the file from the stage, and if you exclude the file in the **.gitignore**, it will not appear in the *untrancked files* list. But you will get a *deleted: file* in the *changes to be commited* list, and the next time you commit, the file in the repo will be deleted. 

If this is not what you want, and you only want to ignore the file locally, and don't want to remove it in the repo, because someone else may need this file, go to the second method.

##### `git update-index \-\-assume-unchanged file`

This method doesn't need **.gitignore**, and will not delete the file in the repo. The disadvantage is: when you clone the repo in other places, you need to run the command again.

## <a name="git_stash"></a>Using `git stash`

Reference:

* [here](http://www.cppblog.com/deercoder/archive/2011/11/13/160007.html): Chinese version 
* [here](http://www.gitguys.com/topics/switching-branches-without-committing/): provide a good scenario for using `git stash`.

### Description

When you are woring on a `newbranch` which is based on an `oldbranch`, and have some uncommitted changes in `newbranch`. But now your manager notice you that there is an urgent issue needs to be fixed in the `oldbranch` right now, and you don't want to commit your changes in `newbranch`, what should we do here?

### Solution

When we trying to checkout `oldbranch` using `git checkout oldbranch`, what is *git* doing? There may be three ways:

1. Ignore the uncommitted working directory changes in `newbranch`, and set the working directory to the files in the `oldbranch`. The uncommited changes in the `newbranch` will be lost.
2. Ignore the state of the files in `oldbranch`, and use the working directory files in `newbranch`. Completely wrong! This will not confirm with the original `oldbranch`. 
3. Attempt to merge in the changes from the working directory in `newbranch` into the files in `oldbranch`.

*Git* actually tries to use *#3* method. 

##### With no confilicts

checkout `oldbranch` from `newbranch` with uncommitted changes in `newbranch`, but **NO Conflicts** between the two branches

The sample log:
{%highlight text linenos %}
M	test.txt
Switched to branch 'oldbranch'
{% endhighlight %}
		
And the `M` means the `test.txt` is successfully merged.

##### With Conflicts

checkout `oldbranch` from `newbranch` with uncommitted changes in `newbranch`, but **With Conflict** between the two branches. In this situation, if you want to checkout `oldbranch` any way, use `git checkout -m oldbranch` which will let git list all the conflicts, as follows:
{%highlight text linenos %}
$ git checkout -m oldbranch
M   test.txt
Switched to branch 'oldbranch'
$ cat test.txt
This is the test file.
<<<<<<< oldbranch
Second line added from the 'oldbranch' branch.
=======
A conflicted line added on the test branch.
>>>>>>> local
$ git branch
* oldbranch
  newbranch
{% endhighlight %}
	  
##### `git stash`

But most of the time, we want to keep the uncommited changes staying in `newbranch`, and `oldbranch` as it was. And when we finish the work in `oldbranch` and get back to `newbranch`, the uncommited changes is still there. For this purpose, we need `git stash`:

1. in `newbranch`, run `git stash`. Check `git status`, and there will be nothing changed.
2. `git checkout oldbranch`.
3. Work in `oldbranch`, and commit the changes.
4. `git checkout newbranch`
5. `git stash pop`

*Git* will hold a stash stack for all the stashes in all branches. That is to say, no matter how many branches you have, you will have only one stash stack. So when you run `git stash pop`, you should check the stash stack using `git stash list`, you will get:
{%highlight text linenos %}
stash@{0}: WIP on oldbranch: 6ed44e2 checkin a new file
stash@{1}: WIP on newbranch: 7a51723 checkin
stash@{2}: WIP on oldbranch: 022cbf7 first checkin
stash@{3}: WIP on newbranch: 6995c80 checkin changes to test.txt
{% endhighlight %}
If you want to roll back the last stash in newbranch, in #5 step, run `git stash pop stash@{1}`. If you don't use the index `stash@{1}`, the top stash in the stash stack will be popped out.

## <a name="kdiff3"></a>Use *kdiff3* as the default tool for git

When you run `git diff`, the difference will be listed in the command window. If you want to see the difference in a visual window (for exmple, *kdiff3*):

1. install *kdiff3* in your mac
2. As the new version of git has build-in support for *kdiff3*, so there is no need for manually configuration, just run 

	   $ git config --global merge.tool *kdiff3*

3. If *kdiff3* is not in your path, run 

	   $ git config --global mergetool.kdiff3.path /Applications/kdiff3.app/Contents/MacOS/kdiff3
		
4. Use `git difftool` instead of `git diff` to let git launch *kdiff3* for the difference. Also use `git mergetool` instead of `git merge` for merging files.

    > Notice: `git mergetool` should be used after `git merge branch_name` and there are some merge conflicts. Use `get help mergetool` for detail.

To check the configuration result, open *~/.gitignore*.


