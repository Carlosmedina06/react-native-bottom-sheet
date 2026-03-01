global.IS_REACT_ACT_ENVIRONMENT = true
global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true
global.__DEV__ = true
global.window = global
global.cancelAnimationFrame = (id) => clearTimeout(id)
global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0)
global.performance = { now: Date.now }
global.nativeFabricUIManager = {}
