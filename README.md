# Select plugin

JavaScript (ES6) custom select plugin without dependencies.

[Demo](https://vvvkor.github.io/select-plugin/)

## Features

- transforms native ``input``, ``select`` or ``div`` into custom select
- populate list
  - from ``option``s of ``select`` element
  - from array
  - from asyncronous request
- control with mouse or keyboard
- set handler for value change
- API (open, close, set, get, clear, destroy)
- custom style
- floating label
- no dependencies

## Usage

Include style and script in the ``head`` of your document:

```html
<link href="select.css" rel="stylesheet">
<script src="select.js"></script> 
```

Initialize element with:

```javascript
new Select(element, options);
```

The *element* can be ``input``, ``select`` or ``div`` element.

### Element attributes

Optional attributes of converted element:

- **data-label** - label text
- **data-value** - initial value (for ``div`` or ``input``)
- **data-src** - URL to fetch array of items (for ``div`` or ``input``)
- **data-size** - visual size in *em*s

For ``select`` element, array of items and initial value are obtained from ``option`` tags.

### Constructor options

Options passed to constructor will override ``data-`` attributes and ``option``s of ``select`` element.

The *options* object may include following keys:

- **label** - label text
- **items** - array of items
- **value** - initial value
- **src** - URL to fetch array of items
- **size** - visual size in *em*s

### Items structure

Data passed in *items* option, as well as data fetched from *src* URL,
should be structured as array of objects, each containing keys for value and label.

Value is looked for in keys **value** and **id**.
Label is looked for in keys **label**, **title** and **name**.

## API

```javascript
// initialize (options object is optional)
let select = new Select(element, options);

// open list
select.open();

// close list
select.close();

// set value
select.set(value);

// get selected item
// returns {id, title}
select.get();

// clear selection
select.clear();

// remove custom element
select.destroy();

// set change handler
select.handle( function( {item, target} ) {
  // console.log(item, target);
});
```
