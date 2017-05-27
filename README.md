# What The Fuck. Img.js
<pre>
The canvas function of html5 is widely used in games and data visualization,
It is also necessary to image fluid data.

For example, if you do not register your profile image on google, it will crop your name and show it as an image.
In the past, these tasks were created and managed separately on the server side,
If you are not going to support a very minor version of browsers by moving to html5
I think this is a problem that can be handled by the "front end".

In conclusion, img.js makes this task easier.
The capacity is only "2kb".
</pre>

So let's look at the source.

```html
<canvas id='cvs'></canvas>
<img cvs-src='cvs::(0,0)' />
```
<pre>
Are you feeling?
If you write the data in a format like '[DOM Canvas Id] :: ([x], [y])' in attribute 'cvs-src' in "img tag"
Find the canvas that matches the "DOM Id" and apply the canvas image data to the "img tag" based on the x and y coordinates you entered.

It is also an advantage that these actions are automatically applied when general context functions (fillRect, lineTo, moveTo ...) are executed.
(It would be fun to see "./js/img.js" source.)

To use this functionality instead, you need to release the context object,
Look at the source below.
</pre>

```javascript
var canvas = document.getElementById('cvs');
var ctx = canvas.getContext('2d');

ctx.release();
```
<pre>
Very simple?

Finally, let's see how to change the command.
This action takes the img tag into javascript,
You can call the setCommand function.
</pre>

```html
<canvas id='cvs'></canvas>
<img id='image' cvs-src='cvs::(0,0)' />
```
```javascript
...ctx.release();

var img = document.getElementById('image');
img.setCommand('(10,10)');
```
