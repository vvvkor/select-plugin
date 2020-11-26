# Select plugin

JavaScript (ES6) select plugin.

[Demo](https://vvvkor.github.io/select-plugin/)

## Features

- transforms native ``input``, ``select`` or ``div`` into custom select
- populate from ``options``, from array, from asyncronous request
- control with mouse or keyboard
- set handler for value change
- API (open, close, set, get, clear, destroy)
- custom style
- floating label

## Usage

Add ``selector`` class to ``input``, ``select`` or ``div`` element.

Optional ``data-`` attributes:

- ``data-label`` - label text
- ``data-value`` - initial value (for ``div`` or ``input``)
- ``data-src`` - URL to fetch list of items (for ``div`` or ``input``)
- ``data-size`` - visual size in ``em``s

Initialize with 

```javascript
new Select(element, options);
```

### Options

Options passed to constructor will override ``data-`` attributes and ``options`` of ``select`` element.

- ``label`` - label text
- ``value`` - initial value
- ``src`` - URL to fetch list of items
- ``items`` - visual size in ``em``s


## API

```javascript
// initialize; options are optional
let select = new Select(element, options);

// open list
select.open();

// close list
select.close();

// set value
select.set(value);

// get selected item
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
