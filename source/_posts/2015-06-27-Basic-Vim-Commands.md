---
layout: post
comments: true
categories: [productivity]
title: Basic Vim Commands
---

**Vim** is an editor to create or edit a text file.

Two modes:

* **command mode**: move around, copy and past
* **insert mode**: insert text

<!-- more -->

###Change mode from one to the other

From *command mode* to *insert mode*, type **i/o(ou)**.
From *inset mode* to *command mode*, type **Esc**.


Some useful commands for Vim. (**Note:** the following commands are only used in command mode.)

###Text Entry Commands

* **i** Insert text before the current cursor position.
* **o(ou)** Open up a new line following the current line and add text there.

###Cursor Movement Commands

* **h/l** Moves the cursor one character to the **left/right**.
* **k/j** Moves the cursor **up/down** one line.
* **nG/:n** Cursor goes to the specified (n) line.
* **^f/^b** One page **forward/backward**.
* **$/0(zero)** Move cursor to the **end/beginning** of current line.
* **w/b** Move cursor **forward/backward** one word.

###Exit Commands
* **:wq/ZZ** Write file to disk and quit the editor.
* **:q!** Quit with no warning.
* **:q** Quit with a warning if a modified file has not been saved.

###Delete

* **x** Delete character under cursor.
* **dw** Delete word from cursor on.
* **db** Delete word backward.
* **dd** Delete line
* **d$** Delete to the end of line.
* **d^(caret)** Delete to the beginning of line.

###Copy and Paste

**Yank** is the **copy** command of Vim.

* **yy** Yank current line.
* **y$** Yank to end o fcurrent line from cursor.
* **yw** Yank from cursor to end of current word.
* **[n]yy** Yank the following **n** lines (including the current line).

**Paste** (used after **Yank**)

* **p** Paste below cursor.

###Search

* **/pattern** Search **forward** for the *pattern*.
* **?pattern** Search **backward** for the *pattern*.
* **n/N** After search, used for moving to the next search result (or reversely).
* **:g/pattern1/s//pattern2/g** Replace every occurrence of *pattern1* with *pattern2*.

###Other Usefull Commands

 * **u** undo
 * **^r(Ctrl+r)** redo
 * **:set number** Display line number.
 * **:set nonumber** Don't display line number.

What's more, most commands can be repeated *n* times by typing a number , *n*, before the command. For example, *10dd* means delete *10* lines.
 
###Set Vim for Python

If you want to write **Python** code in Vim, it is better to set ~/.vimrc (for Mac) to support Python syntax, indent, etc. For default, there is not such file in the HOME path. Just create one.
For the content, refer to official configuration at [here](http://svn.python.org/projects/python/trunk/Misc/Vim/vimrc).

