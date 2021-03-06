# Markdown (but worse)

I wanted to add some "features" to markdown so I put a bunch of regular expressions in a list and ran input from a textarea through that.

# INSTALL

To install run tsc (sudo npm -g install typescript)<br>
open index.html

# Lines of Code

5731

# Queary Strings
* \* or %23 = #
* lightmode: sets to lightmode
* darkmode: sets to darkmode
* editor=color: the color of the editor
* editortext=color: the color of the text of the editor
* preview=color: the color of the preview
* previewtext=color: the color of the preview text

# Documentation

## Text

### General

* any text below \\COLOR:color\\ will be that color
* any text below \\FONT:font\\ will be that font
* any text below \\SIZE:size\\ will be that size
* f\[font]text in here will be font|\[title (optional)]
* ffont->text|
* s\[size]text will be size|\[title (optional)]
* ssize->text|
* #\[color]text here will be color|\[title (optional)]
* #color->text|
* {bg:color any text in here will have a background color of color}\[title (optional)]
* cursor\[type\]text| any text will have a cursor of type
* \[angle]*text* text will be skewed by angle
* ||text||: text will be hidden, clicking will lighten, right clicken will darken
<br>
<br>

* You can add \[color] in front of any of the items below to change the color of the line
    * You can also add \[title] after any of the items below to add a title

* \_underline\_
* \_\_double underline\_\_
* .\_dotted underline\_.
* \~\_wavy underline\_\~
* ^\_overline\_^
* ^^\_double overline\_^^
* ^\~overline wavy\~^
* ^.overline dotted.^
* \*-highlight-*
* \\^\[text]: puts text in a sup element
* \\_\[text]: puts text in a sub element

### General other

* .\[class]text here will be in a span with the class of class|
* \SPACING:line-height\ the whole page will have lineheight of line-height
* spaceing<->text
    * spaces the letters in the words
* \[width:height]textbox|

### Align

* |(margin optional)->center<-(margin optional)|
* |->right(&lt;margin optional)|
* |(margin optional>)left<-|
* 2em-->indented 2em left
* indented 2em right<--2em
* 2em-->indendted 2em right and left<--2em
* 2em->fist line is indneted 2em

---

## Arrows
* --->
* <---
* <-->
* ==>
* <==
* -=>
* <=|
* |=>
* |\v
* |\^
* +-->
* <--+
* <-^->
* <-v->

---

## Quotes

* ''fancy quote''
* \> block quote<br>- author

---

## Input types
* [. ] unchecked clickable checkbox
* \[.x] checked clickable checkbox
* ( ) radio unselected
* (*) radio selected
* \[1-10\]\{5\} slider
* \[.1-10\]\{6\} clickable slider

---

## Custom Elements


### builtins
* c-3d: makes the text have that stereotypical red blue 3d look
* c-rainbow: gives the text a rainbow background
    * not to be confused with \include{rainbow}
* c-circled: makes the text circled
* c-choose: give an items attribute each item is seperated by | put $1 where you wnat the choice to go in the innerHTML
* c-random: give min, max, and round attributes, put $1 where you want the number to go
* c-variables: &lt;c-variables x="yes"&gt;%x%&lt;c-variables&gt;
* c-spacer: puts whitespace
* c-shadow: shadow element
* c-alert: has alert when clicked
* c-rotate: rotates text
* c-textbox: textbox

### includes
* 2 ways to use this
    * \INCLUDE: (item)\
    * \include{item}
* SHADOW: shadow element
* LIMARKER: allows you to do &lt;li marker="marker"> for a custom marker
* BLINK: annoying
* SOFTBLINK: blink but smooth transition
* PLACEHOLDER: kinda just grey unslectable text
* SPIN: css for a spin element
* RAINBOW: css for a rainbow element
    * not to be confused with &lt;c-rainbow>
* KBD: css for the kbd element
* SAMP: css for the samp element
* CMD: css for a cmd element (same css as SAMP)
* HIGHLIGHT: css for code-block syntax highlighting
* L#: css for line-numbers in code-blocks
* LINECOLOR: css color preview for code blocks

---

## Emojis

[List](./Emojis/index.html)

---

## Media

* A!\[audio file] creates an audio tag

---

## Misc

* \\s\\: special escape, escapes out of my markdown because i'm bad
    * \\$: does the same

* \>PRO: pro
* \>CON: con

* (C): copyright
* (R): registered copyright
* \ulmarker:1\cool\\: sets unordered list marker at the 1st level to cool
* \olmarker:2\TYPE:lower-alpha\\: sets ordered list marker at the 2nd level to the lower-alpha type
* \EMOJI\: random "emoji"
* 1//2 makes it look like 1???2
* "summary"...details
* "text"\[title]
* \[word]part of speech (optional): (definition)
* \[text]\*number
    * makes it so that text is duplicated by number
* \n a &lt;br> element
* \\u00ff: unicode escape
* \\u{00f90209f0e098} unicode escape

### Builtin Variables
* %now%: current time
* %today%: today's date

### Builtin Classes
* _html: main class
* _word: word to define class
* _word-speech: part of speech for word
* _definition: definition for word
* _link: used in \[text\]\(link\)
* _double: used in text decoration double
* _overline: used in overline text decoration
* _dotted: used in dotted text decoration
* _wavy: used in wavy text decoration
* _underline: used in underline text decoration

## NOT RECOMMENDED (usually causes lag)
* \RAND\\: random number from 1 to 100
* \RAND{50 56}\\: random number from 1 to 56
* \[VAR:x=2]: will replace any \[x] with 2
* &lt;evaluate>javascript&lt;/evaluate>
    * evaluates the code every times preview updates

### Find

```
\count:(search)\
```

OR

```
\count:(search)
re\
```

* replaces that with how many times the search shows up
    * NOTE: it will be one convert behind since it searches the preview's textContent not the value of the textarea
