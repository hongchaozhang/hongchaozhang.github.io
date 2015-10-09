---
layout: post
comments: true
categories: [python,productivity]
title: pdb commands for python debugging in command line
---

The page is from [MIT](http://web.stanford.edu/class/physics91si/2013/handouts/Pdb_Commands.pdf). Keeping here only for reference.

###Startup and Help

<!-- more -->

<table>
	<tr>
		<td><strong>python -m pdb &lt;name&gt;.py [args]</strong></td>
		<td>begin the debugger</td>
	</tr>
	<tr>
		<td><strong>help [command]</strong></td>
		<td>view a list of command, or view help for a specific command</td>
	</tr>
</table>

Within a python file:

<table>
	<tr>
		<td>import pdb
		<br>...
		<br>pdb.set_trace()</td>
		<td>begin the debugger at this line when the file is run normally</td>
	</tr>
</table>

###Navigating Code (within the pdb interpreter)

<table>
	<tr>
		<td><strong>l</strong>(ist)</td>
		<td>list 11 lines surrounding the current line</td>
	</tr>
	<tr>
		<td><strong>w</strong>(here)</td>
		<td>display the file and line number of the current line</td>
	</tr>
	<tr>
		<td><strong>n</strong>(ext)</td>
		<td>execute the current line</td>
	</tr><tr>
		<td><strong>s</strong>(tep)</td>
		<td>step into functions called at the current line</td>
	</tr><tr>
		<td><strong>r</strong>(eturn)</td>
		<td>execute until the current function's return is encountered</td>
	</tr>
</table>

###Controlling Execution

<table>
	<tr>
		<td><strong>b [#]</strong></td>
		<td>create a breakpoint at line [#]</td>
	</tr>
	<tr>
		<td><strong>b</strong></td>
		<td>list breakpoints and their indices</td>
	</tr>
	<tr>
		<td><strong>c</strong>(ontinue)</td>
		<td>execute until a breakpoint is encountered</td>
	</tr><tr>
		<td><strong>clear [#]</strong></td>
		<td>clear breakpoint of index [#]</td>
	</tr>
</table>

###Changing Variables / Interacting with Code

<table>
	<tr>
		<td><strong>p &lt;name&gt;</strong></td>
		<td>print value of variable &lt;name&gt;</td>
	</tr>
	<tr>
		<td><strong>!&lt;expr&gt;</strong></td>
		<td>execute the expression &lt;expr&gt;</td>
	</tr>
	<tr>
		<td><strong>run [args]</strong></td>
		<td>restart the debugger with sys.argv arguments [args]</td>
	</tr><tr>
		<td><strong>q</strong>(uit)</td>
		<td>exit the debugger</td>
	</tr>
</table>