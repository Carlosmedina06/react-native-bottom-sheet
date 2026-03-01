const React = require('react')

function createHostComponent(name) {
  const fn = (props) => {
    const { children, ...rest } = props || {}
    return React.createElement(name, rest, children)
  }
  fn.displayName = name
  return fn
}

const View = createHostComponent('View')
const Text = createHostComponent('Text')
const TextInput = createHostComponent('TextInput')
const Image = createHostComponent('Image')
const Switch = createHostComponent('Switch')
const ScrollView = createHostComponent('ScrollView')
const Modal = (props) => React.createElement(View, props)
const Pressable = (props) => React.createElement(View, { ...props, onClick: props?.onPress })

module.exports = {
  View,
  Text,
  TextInput,
  Image,
  Switch,
  Modal,
  Pressable,
  ScrollView,
  BackHandler: { addEventListener: () => ({ remove: () => {} }) },
  Dimensions: { get: () => ({ width: 390, height: 844 }) },
  Keyboard: { addListener: () => ({ remove: () => {} }), dismiss: () => {} },
  Platform: { OS: 'ios' },
  StyleSheet: {
    create: (styles) => styles,
    flatten: () => ({}),
  },
  NativeModules: {},
  processColor: (color) => color,
}
