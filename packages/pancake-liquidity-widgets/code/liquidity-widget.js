// eslint-disable

// src/components/Widget/index.tsx
import { useEffect as useEffect19, useMemo as useMemo13 } from 'react'
import { http, createPublicClient } from 'viem'
import * as chains from 'viem/chains'

// src/theme/index.ts
var defaultTheme = {
  cardBackground: '#27262C',
  cardBorder: '#383241',
  background: '#08060B',
  inputBackground: '#372F47',
  inputBorder: '#55496E',
  primary: '#1FC7D4',
  secondary: '#A881FC',
  tertiary: '#353547',
  textSecondary: '#B8ADD2',
  textPrimary: '#F4EEFF',
  textReverse: '#000000',
  warningBackground: '#3D2100',
  wraningBorder: '#5B3400',
  warning: '#ff9d02',
  error: '	#ff3333',
  disabled: '#666171',
  'green-10': '#02382e',
  'green-20': '#035345',
  'green-50': '#129e7D',
}
var lightTheme = {
  cardBackground: '#FFFFFF',
  cardBorder: '#E7E3EB',
  background: '#FAF9FA',
  inputBackground: '#EEEAF4',
  inputBorder: '#D7CAEC',
  primary: '#1FC7D4',
  secondary: '#7645D9',
  tertiary: '#EFF4F5',
  textSecondary: '#7A6EAA',
  textPrimary: '#280D5F',
  textReverse: '#F4EEFF',
  warningBackground: '#FBF2E7',
  wraningBorder: '#F5C38E',
  warning: '#D67E0A',
  error: '#ff3333',
  disabled: '#BDC2C4',
  'green-10': '#EAFBF7',
  'green-20': '#BCEFE2',
  'green-50': '#1BC59C',
}

// src/components/Setting/index.tsx
import { useRef as useRef5, useState as useState11 } from 'react'

// src/components/Tooltip/index.tsx
import { useCallback as useCallback2, useRef as useRef3, useState as useState2 } from 'react'

// ../ui/src/portal.tsx
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
var Portal = ({ children }) => {
  const portalContainer = useRef(null)
  useEffect(() => {
    const kyberPortal = document.createElement('kyber-portal')
    kyberPortal.className = 'ks-lw-style ks-lw-migration-style'
    document.body.appendChild(kyberPortal)
    portalContainer.current = kyberPortal
    return () => {
      if (portalContainer.current && document.body.contains(portalContainer.current)) {
        document.body.removeChild(portalContainer.current)
      }
    }
  }, [])
  if (!portalContainer.current) return null
  return createPortal(children, portalContainer.current)
}

// src/components/Popover/index.tsx
import { useCallback, useState } from 'react'
import { usePopper } from 'react-popper'

// ../hooks/src/use-interval.ts
import { useEffect as useEffect2, useRef as useRef2 } from 'react'
function useInterval(callback, delay, leading = true) {
  const savedCallback = useRef2()
  useEffect2(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect2(() => {
    function tick() {
      const current = savedCallback.current
      current && current()
    }
    if (delay !== null) {
      if (leading) tick()
      const id = setInterval(tick, delay)
      return () => {
        clearInterval(id)
      }
    }
    return void 0
  }, [delay, leading])
}

// src/components/Popover/index.tsx
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
function Popover({ content, show, children, placement = 'auto', noArrow = false }) {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } },
    ],
  })
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx('div', { className: 'inline-block', ref: setReferenceElement, children }),
      /* @__PURE__ */ jsx(Portal, {
        children: /* @__PURE__ */ jsx('div', {
          className: 'ks-lw-style',
          children: /* @__PURE__ */ jsxs('div', {
            className: 'ks-lw-popover',
            'data-visibility': show,
            ref: setPopperElement,
            style: styles.popper,
            ...attributes.popper,
            children: [
              content,
              noArrow ||
                /* @__PURE__ */ jsx('div', {
                  className: `arrow arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`,
                  ref: setArrowElement,
                  style: styles.arrow,
                  ...attributes.arrow,
                }),
            ],
          }),
        }),
      }),
    ],
  })
}

// src/components/Tooltip/index.tsx
import { Fragment as Fragment2, jsx as jsx2 } from 'react/jsx-runtime'
function Tooltip({ text, width, size, onMouseEnter, onMouseLeave, ...rest }) {
  return /* @__PURE__ */ jsx2(Popover, {
    content: text
      ? /* @__PURE__ */ jsx2('div', {
          onMouseEnter,
          onMouseLeave,
          className: 'py-[10px] px-4 font-normal',
          style: {
            width: width || 'max-content',
            lineHeight: 1.5,
            fontSize: `${size || 14}px`,
          },
          children: text,
        })
      : null,
    ...rest,
  })
}
function MouseoverTooltip({ children, disableTooltip, delay, ...rest }) {
  const [show, setShow] = useState2(false)
  const [closeTimeout, setCloseTimeout] = useState2(null)
  const hovering = useRef3(false)
  const open = useCallback2(() => {
    if (rest.text) {
      hovering.current = true
      setTimeout(() => {
        if (hovering.current) setShow(true)
      }, delay || 50)
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        setCloseTimeout(null)
      }
    }
  }, [rest.text, closeTimeout, delay])
  const close = useCallback2(
    () =>
      setCloseTimeout(
        setTimeout(() => {
          hovering.current = false
          setShow(false)
        }, 50),
      ),
    [],
  )
  if (disableTooltip) return /* @__PURE__ */ jsx2(Fragment2, { children })
  return /* @__PURE__ */ jsx2(Tooltip, {
    ...rest,
    show,
    onMouseEnter: open,
    onMouseLeave: close,
    children: /* @__PURE__ */ jsx2('div', {
      onMouseOver: open,
      onMouseLeave: close,
      className: 'flex items-center',
      children,
    }),
  })
}

// src/components/Modal/index.tsx
import ReactDOM from 'react-dom'
import { Fragment as Fragment3, jsx as jsx3 } from 'react/jsx-runtime'
var Modal = ({ isOpen, children, onClick }) => {
  if (!isOpen) return /* @__PURE__ */ jsx3(Fragment3, {})
  return ReactDOM.createPortal(
    /* @__PURE__ */ jsx3('div', {
      className: 'ks-lw-modal-overlay',
      onClick,
      children: /* @__PURE__ */ jsx3('div', {
        className: 'ks-lw-modal-content',
        onClick: (e) => e.stopPropagation(),
        children,
      }),
    }),
    // already created in Widget/index.ts
    document.getElementById('ks-lw-modal-root'),
  )
}
var Modal_default = Modal

// ../../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t,
    f,
    n = ''
  if ('string' == typeof e || 'number' == typeof e) n += e
  else if ('object' == typeof e)
    if (Array.isArray(e)) {
      var o = e.length
      for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += ' '), (n += f))
    } else for (f in e) e[f] && (n && (n += ' '), (n += f))
  return n
}
function clsx() {
  for (var e, t, f = 0, n = '', o = arguments.length; f < o; f++)
    (e = arguments[f]) && (t = r(e)) && (n && (n += ' '), (n += t))
  return n
}

// ../../node_modules/.pnpm/tailwind-merge@2.5.4/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var CLASS_PART_SEPARATOR = '-'
var createClassGroupUtils = (config) => {
  const classMap = createClassMap(config)
  const { conflictingClassGroups, conflictingClassGroupModifiers } = config
  const getClassGroupId = (className) => {
    const classParts = className.split(CLASS_PART_SEPARATOR)
    if (classParts[0] === '' && classParts.length !== 1) {
      classParts.shift()
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className)
  }
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || []
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]]
    }
    return conflicts
  }
  return {
    getClassGroupId,
    getConflictingClassGroupIds,
  }
}
var getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId
  }
  const currentClassPart = classParts[0]
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart)
  const classGroupFromNextClassPart = nextClassPartObject
    ? getGroupRecursive(classParts.slice(1), nextClassPartObject)
    : void 0
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart
  }
  if (classPartObject.validators.length === 0) {
    return void 0
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR)
  return classPartObject.validators.find(({ validator }) => validator(classRest))?.classGroupId
}
var arbitraryPropertyRegex = /^\[(.+)\]$/
var getGroupIdForArbitraryProperty = (className) => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1]
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'))
    if (property) {
      return 'arbitrary..' + property
    }
  }
}
var createClassMap = (config) => {
  const { theme, prefix } = config
  const classMap = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: [],
  }
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix)
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme)
  })
  return classMap
}
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach((classDefinition) => {
    if (typeof classDefinition === 'string') {
      const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition)
      classPartObjectToEdit.classGroupId = classGroupId
      return
    }
    if (typeof classDefinition === 'function') {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme)
        return
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId,
      })
      return
    }
    Object.entries(classDefinition).forEach(([key, classGroup2]) => {
      processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme)
    })
  })
}
var getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject
  path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: [],
      })
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart)
  })
  return currentClassPartObject
}
var isThemeGetter = (func) => func.isThemeGetter
var getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map((classDefinition) => {
      if (typeof classDefinition === 'string') {
        return prefix + classDefinition
      }
      if (typeof classDefinition === 'object') {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]))
      }
      return classDefinition
    })
    return [classGroupId, prefixedClassGroup]
  })
}
var createLruCache = (maxCacheSize) => {
  if (maxCacheSize < 1) {
    return {
      get: () => void 0,
      set: () => {},
    }
  }
  let cacheSize = 0
  let cache = /* @__PURE__ */ new Map()
  let previousCache = /* @__PURE__ */ new Map()
  const update = (key, value) => {
    cache.set(key, value)
    cacheSize++
    if (cacheSize > maxCacheSize) {
      cacheSize = 0
      previousCache = cache
      cache = /* @__PURE__ */ new Map()
    }
  }
  return {
    get(key) {
      let value = cache.get(key)
      if (value !== void 0) {
        return value
      }
      if ((value = previousCache.get(key)) !== void 0) {
        update(key, value)
        return value
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value)
      } else {
        update(key, value)
      }
    },
  }
}
var IMPORTANT_MODIFIER = '!'
var createParseClassName = (config) => {
  const { separator, experimentalParseClassName } = config
  const isSeparatorSingleCharacter = separator.length === 1
  const firstSeparatorCharacter = separator[0]
  const separatorLength = separator.length
  const parseClassName = (className) => {
    const modifiers = []
    let bracketDepth = 0
    let modifierStart = 0
    let postfixModifierPosition
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index]
      if (bracketDepth === 0) {
        if (
          currentCharacter === firstSeparatorCharacter &&
          (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)
        ) {
          modifiers.push(className.slice(modifierStart, index))
          modifierStart = index + separatorLength
          continue
        }
        if (currentCharacter === '/') {
          postfixModifierPosition = index
          continue
        }
      }
      if (currentCharacter === '[') {
        bracketDepth++
      } else if (currentCharacter === ']') {
        bracketDepth--
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart)
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)
    const baseClassName = hasImportantModifier
      ? baseClassNameWithImportantModifier.substring(1)
      : baseClassNameWithImportantModifier
    const maybePostfixModifierPosition =
      postfixModifierPosition && postfixModifierPosition > modifierStart
        ? postfixModifierPosition - modifierStart
        : void 0
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition,
    }
  }
  if (experimentalParseClassName) {
    return (className) =>
      experimentalParseClassName({
        className,
        parseClassName,
      })
  }
  return parseClassName
}
var sortModifiers = (modifiers) => {
  if (modifiers.length <= 1) {
    return modifiers
  }
  const sortedModifiers = []
  let unsortedModifiers = []
  modifiers.forEach((modifier) => {
    const isArbitraryVariant = modifier[0] === '['
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier)
      unsortedModifiers = []
    } else {
      unsortedModifiers.push(modifier)
    }
  })
  sortedModifiers.push(...unsortedModifiers.sort())
  return sortedModifiers
}
var createConfigUtils = (config) => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config),
})
var SPLIT_CLASSES_REGEX = /\s+/
var mergeClassList = (classList, configUtils) => {
  const { parseClassName, getClassGroupId, getConflictingClassGroupIds } = configUtils
  const classGroupsInConflict = []
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX)
  let result = ''
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index]
    const { modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } =
      parseClassName(originalClassName)
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition)
    let classGroupId = getClassGroupId(
      hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName,
    )
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        result = originalClassName + (result.length > 0 ? ' ' + result : result)
        continue
      }
      classGroupId = getClassGroupId(baseClassName)
      if (!classGroupId) {
        result = originalClassName + (result.length > 0 ? ' ' + result : result)
        continue
      }
      hasPostfixModifier = false
    }
    const variantModifier = sortModifiers(modifiers).join(':')
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier
    const classId = modifierId + classGroupId
    if (classGroupsInConflict.includes(classId)) {
      continue
    }
    classGroupsInConflict.push(classId)
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier)
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i]
      classGroupsInConflict.push(modifierId + group)
    }
    result = originalClassName + (result.length > 0 ? ' ' + result : result)
  }
  return result
}
function twJoin() {
  let index = 0
  let argument
  let resolvedValue
  let string = ''
  while (index < arguments.length) {
    if ((argument = arguments[index++])) {
      if ((resolvedValue = toValue(argument))) {
        string && (string += ' ')
        string += resolvedValue
      }
    }
  }
  return string
}
var toValue = (mix) => {
  if (typeof mix === 'string') {
    return mix
  }
  let resolvedValue
  let string = ''
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if ((resolvedValue = toValue(mix[k]))) {
        string && (string += ' ')
        string += resolvedValue
      }
    }
  }
  return string
}
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils
  let cacheGet
  let cacheSet
  let functionToCall = initTailwindMerge
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce(
      (previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig),
      createConfigFirst(),
    )
    configUtils = createConfigUtils(config)
    cacheGet = configUtils.cache.get
    cacheSet = configUtils.cache.set
    functionToCall = tailwindMerge
    return tailwindMerge(classList)
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList)
    if (cachedResult) {
      return cachedResult
    }
    const result = mergeClassList(classList, configUtils)
    cacheSet(classList, result)
    return result
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments))
  }
}
var fromTheme = (key) => {
  const themeGetter = (theme) => theme[key] || []
  themeGetter.isThemeGetter = true
  return themeGetter
}
var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i
var fractionRegex = /^\d+\/\d+$/
var stringLengths = /* @__PURE__ */ new Set(['px', 'full', 'screen'])
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/
var lengthUnitRegex =
  /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/
var isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value)
var isArbitraryLength = (value) => getIsArbitraryValue(value, 'length', isLengthOnly)
var isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value))
var isArbitraryNumber = (value) => getIsArbitraryValue(value, 'number', isNumber)
var isInteger = (value) => Boolean(value) && Number.isInteger(Number(value))
var isPercent = (value) => value.endsWith('%') && isNumber(value.slice(0, -1))
var isArbitraryValue = (value) => arbitraryValueRegex.test(value)
var isTshirtSize = (value) => tshirtUnitRegex.test(value)
var sizeLabels = /* @__PURE__ */ new Set(['length', 'size', 'percentage'])
var isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever)
var isArbitraryPosition = (value) => getIsArbitraryValue(value, 'position', isNever)
var imageLabels = /* @__PURE__ */ new Set(['image', 'url'])
var isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage)
var isArbitraryShadow = (value) => getIsArbitraryValue(value, '', isShadow)
var isAny = () => true
var getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value)
  if (result) {
    if (result[1]) {
      return typeof label === 'string' ? result[1] === label : label.has(result[1])
    }
    return testValue(result[2])
  }
  return false
}
var isLengthOnly = (value) =>
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
var isNever = () => false
var isShadow = (value) => shadowRegex.test(value)
var isImage = (value) => imageRegex.test(value)
var getDefaultConfig = () => {
  const colors = fromTheme('colors')
  const spacing = fromTheme('spacing')
  const blur = fromTheme('blur')
  const brightness = fromTheme('brightness')
  const borderColor = fromTheme('borderColor')
  const borderRadius = fromTheme('borderRadius')
  const borderSpacing = fromTheme('borderSpacing')
  const borderWidth = fromTheme('borderWidth')
  const contrast = fromTheme('contrast')
  const grayscale = fromTheme('grayscale')
  const hueRotate = fromTheme('hueRotate')
  const invert = fromTheme('invert')
  const gap = fromTheme('gap')
  const gradientColorStops = fromTheme('gradientColorStops')
  const gradientColorStopPositions = fromTheme('gradientColorStopPositions')
  const inset = fromTheme('inset')
  const margin = fromTheme('margin')
  const opacity = fromTheme('opacity')
  const padding = fromTheme('padding')
  const saturate = fromTheme('saturate')
  const scale = fromTheme('scale')
  const sepia = fromTheme('sepia')
  const skew = fromTheme('skew')
  const space = fromTheme('space')
  const translate = fromTheme('translate')
  const getOverscroll = () => ['auto', 'contain', 'none']
  const getOverflow = () => ['auto', 'hidden', 'clip', 'visible', 'scroll']
  const getSpacingWithAutoAndArbitrary = () => ['auto', isArbitraryValue, spacing]
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing]
  const getLengthWithEmptyAndArbitrary = () => ['', isLength, isArbitraryLength]
  const getNumberWithAutoAndArbitrary = () => ['auto', isNumber, isArbitraryValue]
  const getPositions = () => [
    'bottom',
    'center',
    'left',
    'left-bottom',
    'left-top',
    'right',
    'right-bottom',
    'right-top',
    'top',
  ]
  const getLineStyles = () => ['solid', 'dashed', 'dotted', 'double', 'none']
  const getBlendModes = () => [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
  ]
  const getAlign = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch']
  const getZeroAndEmpty = () => ['', '0', isArbitraryValue]
  const getBreaks = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column']
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue]
  return {
    cacheSize: 500,
    separator: ':',
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ['none', '', isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ['none', '', 'full', isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary(),
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [
        {
          aspect: ['auto', 'square', 'video', isArbitraryValue],
        },
      ],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ['container'],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [
        {
          columns: [isTshirtSize],
        },
      ],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      'break-after': [
        {
          'break-after': getBreaks(),
        },
      ],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      'break-before': [
        {
          'break-before': getBreaks(),
        },
      ],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      'break-inside': [
        {
          'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'],
        },
      ],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      'box-decoration': [
        {
          'box-decoration': ['slice', 'clone'],
        },
      ],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [
        {
          box: ['border', 'content'],
        },
      ],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: [
        'block',
        'inline-block',
        'inline',
        'flex',
        'inline-flex',
        'table',
        'inline-table',
        'table-caption',
        'table-cell',
        'table-column',
        'table-column-group',
        'table-footer-group',
        'table-header-group',
        'table-row-group',
        'table-row',
        'flow-root',
        'grid',
        'inline-grid',
        'contents',
        'list-item',
        'hidden',
      ],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [
        {
          float: ['right', 'left', 'none', 'start', 'end'],
        },
      ],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [
        {
          clear: ['left', 'right', 'both', 'none', 'start', 'end'],
        },
      ],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ['isolate', 'isolation-auto'],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      'object-fit': [
        {
          object: ['contain', 'cover', 'fill', 'none', 'scale-down'],
        },
      ],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      'object-position': [
        {
          object: [...getPositions(), isArbitraryValue],
        },
      ],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [
        {
          overflow: getOverflow(),
        },
      ],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-x': [
        {
          'overflow-x': getOverflow(),
        },
      ],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-y': [
        {
          'overflow-y': getOverflow(),
        },
      ],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [
        {
          overscroll: getOverscroll(),
        },
      ],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-x': [
        {
          'overscroll-x': getOverscroll(),
        },
      ],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-y': [
        {
          'overscroll-y': getOverscroll(),
        },
      ],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [
        {
          inset: [inset],
        },
      ],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-x': [
        {
          'inset-x': [inset],
        },
      ],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-y': [
        {
          'inset-y': [inset],
        },
      ],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [
        {
          start: [inset],
        },
      ],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [
        {
          end: [inset],
        },
      ],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [
        {
          top: [inset],
        },
      ],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [
        {
          right: [inset],
        },
      ],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [
        {
          bottom: [inset],
        },
      ],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [
        {
          left: [inset],
        },
      ],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ['visible', 'invisible', 'collapse'],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [
        {
          z: ['auto', isInteger, isArbitraryValue],
        },
      ],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [
        {
          basis: getSpacingWithAutoAndArbitrary(),
        },
      ],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      'flex-direction': [
        {
          flex: ['row', 'row-reverse', 'col', 'col-reverse'],
        },
      ],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      'flex-wrap': [
        {
          flex: ['wrap', 'wrap-reverse', 'nowrap'],
        },
      ],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [
        {
          flex: ['1', 'auto', 'initial', 'none', isArbitraryValue],
        },
      ],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [
        {
          grow: getZeroAndEmpty(),
        },
      ],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [
        {
          shrink: getZeroAndEmpty(),
        },
      ],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [
        {
          order: ['first', 'last', 'none', isInteger, isArbitraryValue],
        },
      ],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      'grid-cols': [
        {
          'grid-cols': [isAny],
        },
      ],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start-end': [
        {
          col: [
            'auto',
            {
              span: ['full', isInteger, isArbitraryValue],
            },
            isArbitraryValue,
          ],
        },
      ],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start': [
        {
          'col-start': getNumberWithAutoAndArbitrary(),
        },
      ],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-end': [
        {
          'col-end': getNumberWithAutoAndArbitrary(),
        },
      ],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      'grid-rows': [
        {
          'grid-rows': [isAny],
        },
      ],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start-end': [
        {
          row: [
            'auto',
            {
              span: [isInteger, isArbitraryValue],
            },
            isArbitraryValue,
          ],
        },
      ],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start': [
        {
          'row-start': getNumberWithAutoAndArbitrary(),
        },
      ],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-end': [
        {
          'row-end': getNumberWithAutoAndArbitrary(),
        },
      ],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      'grid-flow': [
        {
          'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'],
        },
      ],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      'auto-cols': [
        {
          'auto-cols': ['auto', 'min', 'max', 'fr', isArbitraryValue],
        },
      ],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      'auto-rows': [
        {
          'auto-rows': ['auto', 'min', 'max', 'fr', isArbitraryValue],
        },
      ],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [
        {
          gap: [gap],
        },
      ],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-x': [
        {
          'gap-x': [gap],
        },
      ],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-y': [
        {
          'gap-y': [gap],
        },
      ],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      'justify-content': [
        {
          justify: ['normal', ...getAlign()],
        },
      ],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      'justify-items': [
        {
          'justify-items': ['start', 'end', 'center', 'stretch'],
        },
      ],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      'justify-self': [
        {
          'justify-self': ['auto', 'start', 'end', 'center', 'stretch'],
        },
      ],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      'align-content': [
        {
          content: ['normal', ...getAlign(), 'baseline'],
        },
      ],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      'align-items': [
        {
          items: ['start', 'end', 'center', 'baseline', 'stretch'],
        },
      ],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      'align-self': [
        {
          self: ['auto', 'start', 'end', 'center', 'stretch', 'baseline'],
        },
      ],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      'place-content': [
        {
          'place-content': [...getAlign(), 'baseline'],
        },
      ],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      'place-items': [
        {
          'place-items': ['start', 'end', 'center', 'baseline', 'stretch'],
        },
      ],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      'place-self': [
        {
          'place-self': ['auto', 'start', 'end', 'center', 'stretch'],
        },
      ],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [
        {
          p: [padding],
        },
      ],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [
        {
          px: [padding],
        },
      ],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [
        {
          py: [padding],
        },
      ],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [
        {
          ps: [padding],
        },
      ],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [
        {
          pe: [padding],
        },
      ],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [
        {
          pt: [padding],
        },
      ],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [
        {
          pr: [padding],
        },
      ],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [
        {
          pb: [padding],
        },
      ],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [
        {
          pl: [padding],
        },
      ],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [
        {
          m: [margin],
        },
      ],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [
        {
          mx: [margin],
        },
      ],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [
        {
          my: [margin],
        },
      ],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [
        {
          ms: [margin],
        },
      ],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [
        {
          me: [margin],
        },
      ],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [
        {
          mt: [margin],
        },
      ],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [
        {
          mr: [margin],
        },
      ],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [
        {
          mb: [margin],
        },
      ],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [
        {
          ml: [margin],
        },
      ],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      'space-x': [
        {
          'space-x': [space],
        },
      ],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-x-reverse': ['space-x-reverse'],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      'space-y': [
        {
          'space-y': [space],
        },
      ],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-y-reverse': ['space-y-reverse'],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [
        {
          w: ['auto', 'min', 'max', 'fit', 'svw', 'lvw', 'dvw', isArbitraryValue, spacing],
        },
      ],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      'min-w': [
        {
          'min-w': [isArbitraryValue, spacing, 'min', 'max', 'fit'],
        },
      ],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      'max-w': [
        {
          'max-w': [
            isArbitraryValue,
            spacing,
            'none',
            'full',
            'min',
            'max',
            'fit',
            'prose',
            {
              screen: [isTshirtSize],
            },
            isTshirtSize,
          ],
        },
      ],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [
        {
          h: [isArbitraryValue, spacing, 'auto', 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'],
        },
      ],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      'min-h': [
        {
          'min-h': [isArbitraryValue, spacing, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'],
        },
      ],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      'max-h': [
        {
          'max-h': [isArbitraryValue, spacing, 'min', 'max', 'fit', 'svh', 'lvh', 'dvh'],
        },
      ],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [
        {
          size: [isArbitraryValue, spacing, 'auto', 'min', 'max', 'fit'],
        },
      ],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      'font-size': [
        {
          text: ['base', isTshirtSize, isArbitraryLength],
        },
      ],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      'font-style': ['italic', 'not-italic'],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      'font-weight': [
        {
          font: [
            'thin',
            'extralight',
            'light',
            'normal',
            'medium',
            'semibold',
            'bold',
            'extrabold',
            'black',
            isArbitraryNumber,
          ],
        },
      ],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      'font-family': [
        {
          font: [isAny],
        },
      ],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-normal': ['normal-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-ordinal': ['ordinal'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-slashed-zero': ['slashed-zero'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractons'],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [
        {
          tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', isArbitraryValue],
        },
      ],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      'line-clamp': [
        {
          'line-clamp': ['none', isNumber, isArbitraryNumber],
        },
      ],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [
        {
          leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', isLength, isArbitraryValue],
        },
      ],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      'list-image': [
        {
          'list-image': ['none', isArbitraryValue],
        },
      ],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      'list-style-type': [
        {
          list: ['none', 'disc', 'decimal', isArbitraryValue],
        },
      ],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      'list-style-position': [
        {
          list: ['inside', 'outside'],
        },
      ],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      'placeholder-color': [
        {
          placeholder: [colors],
        },
      ],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      'placeholder-opacity': [
        {
          'placeholder-opacity': [opacity],
        },
      ],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      'text-alignment': [
        {
          text: ['left', 'center', 'right', 'justify', 'start', 'end'],
        },
      ],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      'text-color': [
        {
          text: [colors],
        },
      ],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      'text-opacity': [
        {
          'text-opacity': [opacity],
        },
      ],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      'text-decoration-style': [
        {
          decoration: [...getLineStyles(), 'wavy'],
        },
      ],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      'text-decoration-thickness': [
        {
          decoration: ['auto', 'from-font', isLength, isArbitraryLength],
        },
      ],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      'underline-offset': [
        {
          'underline-offset': ['auto', isLength, isArbitraryValue],
        },
      ],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      'text-decoration-color': [
        {
          decoration: [colors],
        },
      ],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      'text-wrap': [
        {
          text: ['wrap', 'nowrap', 'balance', 'pretty'],
        },
      ],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [
        {
          indent: getSpacingWithArbitrary(),
        },
      ],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      'vertical-align': [
        {
          align: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super', isArbitraryValue],
        },
      ],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [
        {
          whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'],
        },
      ],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [
        {
          break: ['normal', 'words', 'all', 'keep'],
        },
      ],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [
        {
          hyphens: ['none', 'manual', 'auto'],
        },
      ],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [
        {
          content: ['none', isArbitraryValue],
        },
      ],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      'bg-attachment': [
        {
          bg: ['fixed', 'local', 'scroll'],
        },
      ],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      'bg-clip': [
        {
          'bg-clip': ['border', 'padding', 'content', 'text'],
        },
      ],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      'bg-opacity': [
        {
          'bg-opacity': [opacity],
        },
      ],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      'bg-origin': [
        {
          'bg-origin': ['border', 'padding', 'content'],
        },
      ],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      'bg-position': [
        {
          bg: [...getPositions(), isArbitraryPosition],
        },
      ],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      'bg-repeat': [
        {
          bg: [
            'no-repeat',
            {
              repeat: ['', 'x', 'y', 'round', 'space'],
            },
          ],
        },
      ],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      'bg-size': [
        {
          bg: ['auto', 'cover', 'contain', isArbitrarySize],
        },
      ],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      'bg-image': [
        {
          bg: [
            'none',
            {
              'gradient-to': ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'],
            },
            isArbitraryImage,
          ],
        },
      ],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      'bg-color': [
        {
          bg: [colors],
        },
      ],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from-pos': [
        {
          from: [gradientColorStopPositions],
        },
      ],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via-pos': [
        {
          via: [gradientColorStopPositions],
        },
      ],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to-pos': [
        {
          to: [gradientColorStopPositions],
        },
      ],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from': [
        {
          from: [gradientColorStops],
        },
      ],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via': [
        {
          via: [gradientColorStops],
        },
      ],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to': [
        {
          to: [gradientColorStops],
        },
      ],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [
        {
          rounded: [borderRadius],
        },
      ],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-s': [
        {
          'rounded-s': [borderRadius],
        },
      ],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-e': [
        {
          'rounded-e': [borderRadius],
        },
      ],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-t': [
        {
          'rounded-t': [borderRadius],
        },
      ],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-r': [
        {
          'rounded-r': [borderRadius],
        },
      ],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-b': [
        {
          'rounded-b': [borderRadius],
        },
      ],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-l': [
        {
          'rounded-l': [borderRadius],
        },
      ],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ss': [
        {
          'rounded-ss': [borderRadius],
        },
      ],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-se': [
        {
          'rounded-se': [borderRadius],
        },
      ],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ee': [
        {
          'rounded-ee': [borderRadius],
        },
      ],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-es': [
        {
          'rounded-es': [borderRadius],
        },
      ],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tl': [
        {
          'rounded-tl': [borderRadius],
        },
      ],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tr': [
        {
          'rounded-tr': [borderRadius],
        },
      ],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-br': [
        {
          'rounded-br': [borderRadius],
        },
      ],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-bl': [
        {
          'rounded-bl': [borderRadius],
        },
      ],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w': [
        {
          border: [borderWidth],
        },
      ],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-x': [
        {
          'border-x': [borderWidth],
        },
      ],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-y': [
        {
          'border-y': [borderWidth],
        },
      ],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-s': [
        {
          'border-s': [borderWidth],
        },
      ],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-e': [
        {
          'border-e': [borderWidth],
        },
      ],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-t': [
        {
          'border-t': [borderWidth],
        },
      ],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-r': [
        {
          'border-r': [borderWidth],
        },
      ],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-b': [
        {
          'border-b': [borderWidth],
        },
      ],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-l': [
        {
          'border-l': [borderWidth],
        },
      ],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      'border-opacity': [
        {
          'border-opacity': [opacity],
        },
      ],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      'border-style': [
        {
          border: [...getLineStyles(), 'hidden'],
        },
      ],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x': [
        {
          'divide-x': [borderWidth],
        },
      ],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x-reverse': ['divide-x-reverse'],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y': [
        {
          'divide-y': [borderWidth],
        },
      ],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y-reverse': ['divide-y-reverse'],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      'divide-opacity': [
        {
          'divide-opacity': [opacity],
        },
      ],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      'divide-style': [
        {
          divide: getLineStyles(),
        },
      ],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color': [
        {
          border: [borderColor],
        },
      ],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-x': [
        {
          'border-x': [borderColor],
        },
      ],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-y': [
        {
          'border-y': [borderColor],
        },
      ],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-s': [
        {
          'border-s': [borderColor],
        },
      ],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-e': [
        {
          'border-e': [borderColor],
        },
      ],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-t': [
        {
          'border-t': [borderColor],
        },
      ],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-r': [
        {
          'border-r': [borderColor],
        },
      ],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-b': [
        {
          'border-b': [borderColor],
        },
      ],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-l': [
        {
          'border-l': [borderColor],
        },
      ],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      'divide-color': [
        {
          divide: [borderColor],
        },
      ],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      'outline-style': [
        {
          outline: ['', ...getLineStyles()],
        },
      ],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      'outline-offset': [
        {
          'outline-offset': [isLength, isArbitraryValue],
        },
      ],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      'outline-w': [
        {
          outline: [isLength, isArbitraryLength],
        },
      ],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      'outline-color': [
        {
          outline: [colors],
        },
      ],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w': [
        {
          ring: getLengthWithEmptyAndArbitrary(),
        },
      ],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w-inset': ['ring-inset'],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      'ring-color': [
        {
          ring: [colors],
        },
      ],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      'ring-opacity': [
        {
          'ring-opacity': [opacity],
        },
      ],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      'ring-offset-w': [
        {
          'ring-offset': [isLength, isArbitraryLength],
        },
      ],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      'ring-offset-color': [
        {
          'ring-offset': [colors],
        },
      ],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [
        {
          shadow: ['', 'inner', 'none', isTshirtSize, isArbitraryShadow],
        },
      ],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      'shadow-color': [
        {
          shadow: [isAny],
        },
      ],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [
        {
          opacity: [opacity],
        },
      ],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      'mix-blend': [
        {
          'mix-blend': [...getBlendModes(), 'plus-lighter', 'plus-darker'],
        },
      ],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      'bg-blend': [
        {
          'bg-blend': getBlendModes(),
        },
      ],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [
        {
          filter: ['', 'none'],
        },
      ],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [
        {
          blur: [blur],
        },
      ],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [
        {
          brightness: [brightness],
        },
      ],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [
        {
          contrast: [contrast],
        },
      ],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      'drop-shadow': [
        {
          'drop-shadow': ['', 'none', isTshirtSize, isArbitraryValue],
        },
      ],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [
        {
          grayscale: [grayscale],
        },
      ],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      'hue-rotate': [
        {
          'hue-rotate': [hueRotate],
        },
      ],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [
        {
          invert: [invert],
        },
      ],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [
        {
          saturate: [saturate],
        },
      ],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [
        {
          sepia: [sepia],
        },
      ],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      'backdrop-filter': [
        {
          'backdrop-filter': ['', 'none'],
        },
      ],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      'backdrop-blur': [
        {
          'backdrop-blur': [blur],
        },
      ],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      'backdrop-brightness': [
        {
          'backdrop-brightness': [brightness],
        },
      ],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      'backdrop-contrast': [
        {
          'backdrop-contrast': [contrast],
        },
      ],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      'backdrop-grayscale': [
        {
          'backdrop-grayscale': [grayscale],
        },
      ],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      'backdrop-hue-rotate': [
        {
          'backdrop-hue-rotate': [hueRotate],
        },
      ],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      'backdrop-invert': [
        {
          'backdrop-invert': [invert],
        },
      ],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      'backdrop-opacity': [
        {
          'backdrop-opacity': [opacity],
        },
      ],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      'backdrop-saturate': [
        {
          'backdrop-saturate': [saturate],
        },
      ],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      'backdrop-sepia': [
        {
          'backdrop-sepia': [sepia],
        },
      ],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      'border-collapse': [
        {
          border: ['collapse', 'separate'],
        },
      ],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing': [
        {
          'border-spacing': [borderSpacing],
        },
      ],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-x': [
        {
          'border-spacing-x': [borderSpacing],
        },
      ],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-y': [
        {
          'border-spacing-y': [borderSpacing],
        },
      ],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      'table-layout': [
        {
          table: ['auto', 'fixed'],
        },
      ],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [
        {
          caption: ['top', 'bottom'],
        },
      ],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [
        {
          transition: ['none', 'all', '', 'colors', 'opacity', 'shadow', 'transform', isArbitraryValue],
        },
      ],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [
        {
          duration: getNumberAndArbitrary(),
        },
      ],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [
        {
          ease: ['linear', 'in', 'out', 'in-out', isArbitraryValue],
        },
      ],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [
        {
          delay: getNumberAndArbitrary(),
        },
      ],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [
        {
          animate: ['none', 'spin', 'ping', 'pulse', 'bounce', isArbitraryValue],
        },
      ],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [
        {
          transform: ['', 'gpu', 'none'],
        },
      ],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [
        {
          scale: [scale],
        },
      ],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-x': [
        {
          'scale-x': [scale],
        },
      ],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-y': [
        {
          'scale-y': [scale],
        },
      ],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [
        {
          rotate: [isInteger, isArbitraryValue],
        },
      ],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-x': [
        {
          'translate-x': [translate],
        },
      ],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-y': [
        {
          'translate-y': [translate],
        },
      ],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-x': [
        {
          'skew-x': [skew],
        },
      ],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-y': [
        {
          'skew-y': [skew],
        },
      ],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      'transform-origin': [
        {
          origin: [
            'center',
            'top',
            'top-right',
            'right',
            'bottom-right',
            'bottom',
            'bottom-left',
            'left',
            'top-left',
            isArbitraryValue,
          ],
        },
      ],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [
        {
          accent: ['auto', colors],
        },
      ],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [
        {
          appearance: ['none', 'auto'],
        },
      ],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [
        {
          cursor: [
            'auto',
            'default',
            'pointer',
            'wait',
            'text',
            'move',
            'help',
            'not-allowed',
            'none',
            'context-menu',
            'progress',
            'cell',
            'crosshair',
            'vertical-text',
            'alias',
            'copy',
            'no-drop',
            'grab',
            'grabbing',
            'all-scroll',
            'col-resize',
            'row-resize',
            'n-resize',
            'e-resize',
            's-resize',
            'w-resize',
            'ne-resize',
            'nw-resize',
            'se-resize',
            'sw-resize',
            'ew-resize',
            'ns-resize',
            'nesw-resize',
            'nwse-resize',
            'zoom-in',
            'zoom-out',
            isArbitraryValue,
          ],
        },
      ],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      'caret-color': [
        {
          caret: [colors],
        },
      ],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      'pointer-events': [
        {
          'pointer-events': ['none', 'auto'],
        },
      ],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [
        {
          resize: ['none', 'y', 'x', ''],
        },
      ],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      'scroll-behavior': [
        {
          scroll: ['auto', 'smooth'],
        },
      ],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-m': [
        {
          'scroll-m': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mx': [
        {
          'scroll-mx': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-my': [
        {
          'scroll-my': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ms': [
        {
          'scroll-ms': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-me': [
        {
          'scroll-me': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mt': [
        {
          'scroll-mt': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mr': [
        {
          'scroll-mr': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mb': [
        {
          'scroll-mb': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ml': [
        {
          'scroll-ml': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-p': [
        {
          'scroll-p': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-px': [
        {
          'scroll-px': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-py': [
        {
          'scroll-py': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-ps': [
        {
          'scroll-ps': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pe': [
        {
          'scroll-pe': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pt': [
        {
          'scroll-pt': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pr': [
        {
          'scroll-pr': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pb': [
        {
          'scroll-pb': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pl': [
        {
          'scroll-pl': getSpacingWithArbitrary(),
        },
      ],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      'snap-align': [
        {
          snap: ['start', 'end', 'center', 'align-none'],
        },
      ],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      'snap-stop': [
        {
          snap: ['normal', 'always'],
        },
      ],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-type': [
        {
          snap: ['none', 'x', 'y', 'both'],
        },
      ],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-strictness': [
        {
          snap: ['mandatory', 'proximity'],
        },
      ],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [
        {
          touch: ['auto', 'none', 'manipulation'],
        },
      ],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-x': [
        {
          'touch-pan': ['x', 'left', 'right'],
        },
      ],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-y': [
        {
          'touch-pan': ['y', 'up', 'down'],
        },
      ],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-pz': ['touch-pinch-zoom'],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [
        {
          select: ['none', 'text', 'all', 'auto'],
        },
      ],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      'will-change': [
        {
          'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryValue],
        },
      ],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [
        {
          fill: [colors, 'none'],
        },
      ],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      'stroke-w': [
        {
          stroke: [isLength, isArbitraryLength, isArbitraryNumber],
        },
      ],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [
        {
          stroke: [colors, 'none'],
        },
      ],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ['sr-only', 'not-sr-only'],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      'forced-color-adjust': [
        {
          'forced-color-adjust': ['auto', 'none'],
        },
      ],
    },
    conflictingClassGroups: {
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      size: ['w', 'h'],
      'font-size': ['leading'],
      'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      'line-clamp': ['display', 'overflow'],
      rounded: [
        'rounded-s',
        'rounded-e',
        'rounded-t',
        'rounded-r',
        'rounded-b',
        'rounded-l',
        'rounded-ss',
        'rounded-se',
        'rounded-ee',
        'rounded-es',
        'rounded-tl',
        'rounded-tr',
        'rounded-br',
        'rounded-bl',
      ],
      'rounded-s': ['rounded-ss', 'rounded-es'],
      'rounded-e': ['rounded-se', 'rounded-ee'],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': ['border-w-s', 'border-w-e', 'border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': [
        'border-color-s',
        'border-color-e',
        'border-color-t',
        'border-color-r',
        'border-color-b',
        'border-color-l',
      ],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      'scroll-m': [
        'scroll-mx',
        'scroll-my',
        'scroll-ms',
        'scroll-me',
        'scroll-mt',
        'scroll-mr',
        'scroll-mb',
        'scroll-ml',
      ],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': [
        'scroll-px',
        'scroll-py',
        'scroll-ps',
        'scroll-pe',
        'scroll-pt',
        'scroll-pr',
        'scroll-pb',
        'scroll-pl',
      ],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb'],
      touch: ['touch-x', 'touch-y', 'touch-pz'],
      'touch-x': ['touch'],
      'touch-y': ['touch'],
      'touch-pz': ['touch'],
    },
    conflictingClassGroupModifiers: {
      'font-size': ['leading'],
    },
  }
}
var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig)

// ../utils/src/tailwind-helpers.ts
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// src/components/Input/index.tsx
import { jsx as jsx4 } from 'react/jsx-runtime'
function Input(props) {
  const { className, ...rest } = props
  return /* @__PURE__ */ jsx4('input', {
    className: cn(
      'border-none outline-none bg-inputBackground text-[var(--ks-lw-text)] rounded-md w-full py-2 px-4 leading-6 placeholder-textSecondary',
      className,
    ),
    ...rest,
  })
}

// src/components/Toggle/index.tsx
import { jsx as jsx5 } from 'react/jsx-runtime'
var Toggle = ({ id, isActive, toggle, style, icon }) => {
  return /* @__PURE__ */ jsx5('div', {
    id,
    onClick: toggle,
    'data-active': isActive,
    className:
      "relative w-14 h-7 bg-disabled rounded-full transition-all duration-200 ease-in-out cursor-pointer data-[active='true']:bg-[#31d0aa]",
    style: { boxShadow: '0px 2px 0px -1px #0000000f inset', ...style },
    children: /* @__PURE__ */ jsx5('div', {
      'data-active': isActive,
      className:
        "absolute top-1/2 left-[2px] w-6 h-6 bg-cardBackground rounded-[50%] -translate-y-1/2 transition-all duration-200 ease-in-out flex items-center justify-center data-[active='true']:bg-cardBackground data-[active='true']:left-[30px] data-[active='true']:opacity-100",
      children: isActive && icon,
    }),
  })
}
var Toggle_default = Toggle

// src/components/Setting/SlippageInput.tsx
import { useState as useState10 } from 'react'

// src/hooks/useZapInState.tsx
import {
  createContext as createContext4,
  useCallback as useCallback6,
  useContext as useContext4,
  useEffect as useEffect9,
  useMemo as useMemo3,
  useState as useState9,
} from 'react'
import { formatUnits, parseUnits } from 'viem'

// src/hooks/useWidgetInfo.tsx
import { createContext as createContext2, useContext as useContext2 } from 'react'

// src/hooks/usePoolInfo/pancakev3.ts
import { Position as PancakePosition } from '@pancakeswap/v3-sdk'
import { useEffect as useEffect3, useState as useState3 } from 'react'

// src/abis/pancakev3_pool.ts
var Pancakev3PoolABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        indexed: true,
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'Burn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        indexed: true,
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount0',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount1',
        type: 'uint128',
      },
    ],
    name: 'Collect',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount0',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount1',
        type: 'uint128',
      },
    ],
    name: 'CollectProtocol',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'paid0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'paid1',
        type: 'uint256',
      },
    ],
    name: 'Flash',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: 'observationCardinalityNextOld',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'observationCardinalityNextNew',
        type: 'uint16',
      },
    ],
    name: 'IncreaseObservationCardinalityNext',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
    ],
    name: 'Initialize',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        indexed: true,
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint32',
        name: 'feeProtocol0Old',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'feeProtocol1Old',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'feeProtocol0New',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'feeProtocol1New',
        type: 'uint32',
      },
    ],
    name: 'SetFeeProtocol',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'SetLmPoolEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'amount0',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'amount1',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'protocolFeesToken0',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'protocolFeesToken1',
        type: 'uint128',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
    ],
    name: 'burn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        internalType: 'uint128',
        name: 'amount0Requested',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'amount1Requested',
        type: 'uint128',
      },
    ],
    name: 'collect',
    outputs: [
      {
        internalType: 'uint128',
        name: 'amount0',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'amount1',
        type: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint128',
        name: 'amount0Requested',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'amount1Requested',
        type: 'uint128',
      },
    ],
    name: 'collectProtocol',
    outputs: [
      {
        internalType: 'uint128',
        name: 'amount0',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'amount1',
        type: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [
      {
        internalType: 'uint24',
        name: '',
        type: 'uint24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'observationCardinalityNext',
        type: 'uint16',
      },
    ],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'liquidity',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lmPool',
    outputs: [
      {
        internalType: 'contract IPancakeV3LmPool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'observations',
    outputs: [
      {
        internalType: 'uint32',
        name: 'blockTimestamp',
        type: 'uint32',
      },
      {
        internalType: 'int56',
        name: 'tickCumulative',
        type: 'int56',
      },
      {
        internalType: 'uint160',
        name: 'secondsPerLiquidityCumulativeX128',
        type: 'uint160',
      },
      {
        internalType: 'bool',
        name: 'initialized',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32[]',
        name: 'secondsAgos',
        type: 'uint32[]',
      },
    ],
    name: 'observe',
    outputs: [
      {
        internalType: 'int56[]',
        name: 'tickCumulatives',
        type: 'int56[]',
      },
      {
        internalType: 'uint160[]',
        name: 'secondsPerLiquidityCumulativeX128s',
        type: 'uint160[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'positions',
    outputs: [
      {
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside0LastX128',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside1LastX128',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'tokensOwed0',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'tokensOwed1',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'protocolFees',
    outputs: [
      {
        internalType: 'uint128',
        name: 'token0',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'token1',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'feeProtocol0',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'feeProtocol1',
        type: 'uint32',
      },
    ],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_lmPool',
        type: 'address',
      },
    ],
    name: 'setLmPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      {
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      {
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
      {
        internalType: 'uint16',
        name: 'observationIndex',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinality',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinalityNext',
        type: 'uint16',
      },
      {
        internalType: 'uint32',
        name: 'feeProtocol',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'unlocked',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      {
        internalType: 'int56',
        name: 'tickCumulativeInside',
        type: 'int56',
      },
      {
        internalType: 'uint160',
        name: 'secondsPerLiquidityInsideX128',
        type: 'uint160',
      },
      {
        internalType: 'uint32',
        name: 'secondsInside',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'zeroForOne',
        type: 'bool',
      },
      {
        internalType: 'int256',
        name: 'amountSpecified',
        type: 'int256',
      },
      {
        internalType: 'uint160',
        name: 'sqrtPriceLimitX96',
        type: 'uint160',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'swap',
    outputs: [
      {
        internalType: 'int256',
        name: 'amount0',
        type: 'int256',
      },
      {
        internalType: 'int256',
        name: 'amount1',
        type: 'int256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int16',
        name: '',
        type: 'int16',
      },
    ],
    name: 'tickBitmap',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tickSpacing',
    outputs: [
      {
        internalType: 'int24',
        name: '',
        type: 'int24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: '',
        type: 'int24',
      },
    ],
    name: 'ticks',
    outputs: [
      {
        internalType: 'uint128',
        name: 'liquidityGross',
        type: 'uint128',
      },
      {
        internalType: 'int128',
        name: 'liquidityNet',
        type: 'int128',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthOutside0X128',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthOutside1X128',
        type: 'uint256',
      },
      {
        internalType: 'int56',
        name: 'tickCumulativeOutside',
        type: 'int56',
      },
      {
        internalType: 'uint160',
        name: 'secondsPerLiquidityOutsideX128',
        type: 'uint160',
      },
      {
        internalType: 'uint32',
        name: 'secondsOutside',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'initialized',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token0',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token1',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

// src/abis/pancakev3_pos_manager.ts
var Pancakev3PosManagerABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'positions',
    outputs: [
      {
        internalType: 'uint96',
        name: 'nonce',
        type: 'uint96',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
      {
        internalType: 'uint24',
        name: 'fee',
        type: 'uint24',
      },
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside0LastX128',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'feeGrowthInside1LastX128',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'tokensOwed0',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'tokensOwed1',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

// src/hooks/useProvider.tsx
import { createContext, useContext } from 'react'
import { jsx as jsx6 } from 'react/jsx-runtime'
var Web3Context = createContext(void 0)
var Web3Provider = ({ children, ...otherProps }) => {
  return /* @__PURE__ */ jsx6(Web3Context.Provider, { value: otherProps, children })
}
var useWeb3Provider = () => {
  const context = useContext(Web3Context)
  if (context === void 0) {
    throw new Error('useWeb3Provider must be used within a Web3Provider')
  }
  return context
}

// src/constants/index.ts
var NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
var NetworkInfo = {
  1: {
    name: 'Ethereum',
    logo: 'https://storage.googleapis.com/ks-setting-1d682dca/fd07cf5c-3ddf-4215-aa51-e6ee2c60afbc1697031732146.png',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://etherscan.io',
    multiCall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    defaultRpc: 'https://ethereum.kyberengineering.io',
    wrappedToken: {
      chainId: 1,
      name: 'WETH',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      decimals: 18,
    },
  },
  56: {
    name: 'BSC',
    nativeLogo: 'https://storage.googleapis.com/ks-setting-1d682dca/d15d102e-6c7c-42f7-9dc4-79f3b1f9cc9b.png',
    logo: 'https://storage.googleapis.com/ks-setting-1d682dca/14c1b7c4-b66e-4169-b82e-ea6237f15b461699420601184.png',
    scanLink: 'https://bscscan.com',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://bsc.kyberengineering.io',
    wrappedToken: {
      chainId: 56,
      name: 'WBNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      symbol: 'WBNB',
      decimals: 18,
    },
  },
  137: {
    name: 'Polygon POS',
    logo: 'https://polygonscan.com/assets/poly/images/svg/logos/token-light.svg?v=24.2.3.1',
    nativeLogo: 'https://storage.googleapis.com/ks-setting-1d682dca/10d6d017-945d-470d-87eb-6a6f89ce8b7e.png',
    scanLink: 'https://polygonscan.com',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://polygon.kyberengineering.io',
    wrappedToken: {
      chainId: 137,
      name: 'WMATIC',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      symbol: 'WMATIC',
      decimals: 18,
    },
  },
  42161: {
    name: 'Arbitrum',
    logo: 'https://raw.githubusercontent.com/KyberNetwork/kyberswap-interface/main/src/assets/networks/arbitrum.svg',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://arbiscan.io',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://arbitrum.kyberengineering.io',
    wrappedToken: {
      chainId: 42161,
      name: 'WETH',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      symbol: 'WETH',
      decimals: 18,
    },
  },
  43114: {
    name: 'Avalanche',
    logo: 'https://raw.githubusercontent.com/KyberNetwork/kyberswap-interface/main/src/assets/networks/avalanche.svg',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/e72081b5-cb5f-4fb6-b771-ac189bdfd7c81699420213175.png',
    scanLink: 'https://snowscan.xyz',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://avalanche.kyberengineering.io',
    wrappedToken: {
      chainId: 43114,
      name: 'WAVAX',
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      symbol: 'WAVAX',
      decimals: 18,
    },
  },
  8453: {
    name: 'Base',
    logo: 'https://raw.githubusercontent.com/base-org/brand-kit/001c0e9b40a67799ebe0418671ac4e02a0c683ce/logo/in-product/Base_Network_Logo.svg',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://basescan.org',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://mainnet.base.org',
    wrappedToken: {
      chainId: 8453,
      name: 'ETH',
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      decimals: 18,
    },
  },
  146: {
    name: 'Sonic',
    logo: 'https://raw.githubusercontent.com/base-org/brand-kit/001c0e9b40a67799ebe0418671ac4e02a0c683ce/logo/in-product/Base_Network_Logo.svg',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://basescan.org',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://sonic-rpc.publicnode.com',
    wrappedToken: {
      chainId: 146,
      name: 'S',
      address: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38',
      symbol: 'WS',
      decimals: 18,
    },
  },
  81457: {
    name: 'Blast',
    logo: 'https://static.debank.com/image/project/logo_url/blast/c0e1eb5f4051bd62ca904cf2e3282f47.png',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://blastscan.io',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://rpc.blast.io',
    wrappedToken: {
      chainId: 81457,
      name: 'ETH',
      address: '0x4300000000000000000000000000000000000004',
      symbol: 'WETH',
      decimals: 18,
    },
  },
  250: {
    name: 'Fantom',
    logo: 'https://raw.githubusercontent.com/KyberNetwork/kyberswap-interface/main/src/assets/networks/fantom.svg',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/2cd8adf9-b4b0-41f7-b83d-4a13b4e9ca6f1699420090962.png',
    scanLink: 'https://ftmscan.com',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://rpc.fantom.network	',
    wrappedToken: {
      chainId: 250,
      name: 'WFTM',
      address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
      symbol: 'WFTM',
      decimals: 18,
    },
  },
  59144: {
    name: 'Linea',
    logo: 'https://storage.googleapis.com/ks-setting-1d682dca/12a257d3-65e3-4b16-8a84-03a4ca34a6bc1693378197244.svg',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://lineascan.build',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://rpc.linea.build',
    wrappedToken: {
      chainId: 59144,
      name: 'WETH',
      address: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
      symbol: 'WETH',
      decimals: 18,
    },
  },
  5e3: {
    name: 'Mantle',
    logo: 'https://storage.googleapis.com/ks-setting-1d682dca/2bccd96f-b100-4ca1-858e-d8353ab0d0861710387147471.png',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/2bccd96f-b100-4ca1-858e-d8353ab0d0861710387147471.png',
    scanLink: 'https://mantlescan.info',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://rpc.mantle.xyz',
    wrappedToken: {
      chainId: 5e3,
      name: 'WMNT',
      address: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
      symbol: 'WMNT',
      decimals: 18,
    },
  },
  10: {
    name: 'Optimism',
    logo: 'https://raw.githubusercontent.com/KyberNetwork/kyberswap-interface/main/src/assets/networks/optimism.svg',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://optimistic.etherscan.io',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://optimism.kyberengineering.io',
    wrappedToken: {
      chainId: 10,
      name: 'WETH',
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      decimals: 18,
    },
  },
  534352: {
    name: 'Scroll',
    logo: 'https://storage.googleapis.com/ks-setting-1d682dca/fe12013c-4d72-4ac3-9415-a278b7d474c71697595633825.png',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://scrollscan.com',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://rpc.scroll.io',
    wrappedToken: {
      chainId: 534352,
      name: 'WETH',
      address: '0x5300000000000000000000000000000000000004',
      symbol: 'WETH',
      decimals: 18,
    },
  },
  1101: {
    name: 'Polygyon ZkEVM',
    logo: 'https://storage.googleapis.com/ks-setting-1d682dca/815d1f9c-86b2-4515-8bb1-4212106321c01699420293856.png',
    nativeLogo:
      'https://storage.googleapis.com/ks-setting-1d682dca/8fca1ea5-2637-48bc-bb08-c734065442fe1693634037115.png',
    scanLink: 'https://zkevm.polygonscan.com',
    multiCall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    defaultRpc: 'https://zkevm-rpc.com',
    wrappedToken: {
      chainId: 1101,
      name: 'WETH',
      address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
      symbol: 'WETH',
      decimals: 18,
    },
  },
}
var PANCAKE_NFT_MANAGER_CONTRACT = {
  1: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  56: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  137: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  42161: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  43114: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  8453: '0x1409a523F5bE27989Af9321Cc0EC1d441ACa6d9B',
  146: '0x61fF993976682601A819A231837Dd865382d8e9C',
  81457: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  250: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  59144: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  5e3: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  10: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  534352: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  1101: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
}
var BASE_BPS = 1e4
var PATHS = {
  KYBERSWAP_SETTING_API: 'https://ks-setting.kyberswap.com/api/v1/tokens',
}
var chainIdToChain = {
  1: 'ethereum',
  137: 'polygon',
  56: 'bsc',
  42161: 'arbitrum',
  43114: 'avalanche',
  8453: 'base',
  146: 'sonic',
  81457: 'blast',
  250: 'fantom',
  5e3: 'mantle',
  10: 'optimism',
  534352: 'scroll',
  59144: 'linea',
  1101: 'polygon-zkevm',
}
var MAX_ZAP_IN_TOKENS = 5

// src/entities/Pool.ts
import { TickMath, TICK_SPACINGS, nearestUsableTick, Pool } from '@pancakeswap/v3-sdk'
import { Token } from '@pancakeswap/sdk'
var PancakeToken = class extends Token {
  logoURI
  constructor(chainId, address, decimals, symbol, name, logoURI) {
    super(chainId, address, decimals, symbol || '', name)
    this.logoURI = logoURI
  }
}
var PancakeV3Pool = class _PancakeV3Pool extends Pool {
  constructor(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent) {
    super(tokenA, tokenB, fee, sqrtRatioX96, liquidity, tickCurrent)
  }
  get maxTick() {
    return nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[this.fee])
  }
  get minTick() {
    return nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[this.fee])
  }
  newPool({ sqrtRatioX96, liquidity, tick }) {
    const pool = new _PancakeV3Pool(this.token0, this.token1, this.fee, sqrtRatioX96, liquidity, tick)
    return pool
  }
}

// src/hooks/usePoolInfo/pancakev3.ts
function usePoolInfo(poolAddress, positionId) {
  const [loading, setLoading] = useState3(true)
  const [pool, setPool] = useState3(null)
  const [position, setPosition] = useState3(null)
  const [positionOwner, setPositionOwner] = useState3(null)
  const { chainId, publicClient } = useWeb3Provider()
  const posManagerContractAddress = PANCAKE_NFT_MANAGER_CONTRACT[chainId]
  const [error, setError] = useState3('')
  useEffect3(() => {
    const getPoolInfo = async () => {
      if (!publicClient || !!pool) {
        setLoading(false)
        return
      }
      const multiCallRes = await publicClient.multicall({
        contracts: [
          {
            address: poolAddress,
            abi: Pancakev3PoolABI,
            functionName: 'token0',
          },
          {
            address: poolAddress,
            abi: Pancakev3PoolABI,
            functionName: 'token1',
          },
          {
            address: poolAddress,
            abi: Pancakev3PoolABI,
            functionName: 'fee',
          },
          {
            address: poolAddress,
            abi: Pancakev3PoolABI,
            functionName: 'slot0',
          },
          {
            address: poolAddress,
            abi: Pancakev3PoolABI,
            functionName: 'liquidity',
          },
        ],
      })
      const [address0, address1, fee, slot0, liquidity] = [
        multiCallRes[0].result,
        multiCallRes[1].result,
        multiCallRes[2].result,
        multiCallRes[3].result || [],
        multiCallRes[4].result,
      ]
      const [sqrtPriceX96, tick] = slot0
      if (!address0 || !address1 || !fee || !liquidity) {
        setError(
          `Can't get Pool info for pool address ${poolAddress.substring(0, 6)}...${poolAddress.substring(36)} on ${
            NetworkInfo[chainId].name
          }`,
        )
        return
      }
      const tokens = await fetch(
        `https://ks-setting.kyberswap.com/api/v1/tokens?chainIds=${chainId}&addresses=${address0},${address1}`,
      )
        .then((res) => res.json())
        .then((res) => res?.data?.tokens || [])
      let token0Info = tokens.find((tk) => tk.address.toLowerCase() === address0.toLowerCase())
      let token1Info = tokens.find((tk) => tk.address.toLowerCase() === address1.toLowerCase())
      const addressToImport = [...(!token0Info ? [address0] : []), ...(!token1Info ? [address1] : [])]
      if (addressToImport.length) {
        const tokens2 = await fetch('https://ks-setting.kyberswap.com/api/v1/tokens/import', {
          method: 'POST',
          body: JSON.stringify({
            tokens: addressToImport.map((item) => ({
              chainId: chainId.toString(),
              address: item,
            })),
          }),
        })
          .then((res) => res.json())
          .then(
            (res) =>
              res?.data?.tokens.map((item) => ({
                ...item.data,
                chainId: +item.data.chainId,
              })) || [],
          )
        if (!token0Info) token0Info = tokens2.find((item) => item.address.toLowerCase() === address0.toLowerCase())
        if (!token1Info) token1Info = tokens2.find((item) => item.address.toLowerCase() === address1.toLowerCase())
      }
      if (token0Info && token1Info && fee) {
        const initToken = (t) =>
          new PancakeToken(
            t.chainId,
            t.address,
            t.decimals,
            t.symbol,
            t.name,
            t.logoURI || `https://ui-avatars.com/api/?name=?`,
          )
        const token0 = initToken(token0Info)
        const token1 = initToken(token1Info)
        const pool2 = new PancakeV3Pool(token0, token1, fee, sqrtPriceX96, liquidity, tick)
        setPool(pool2)
        if (positionId && publicClient) {
          const multiCallRes2 = await publicClient.multicall({
            contracts: [
              {
                address: posManagerContractAddress,
                abi: Pancakev3PosManagerABI,
                functionName: 'ownerOf',
                args: [BigInt(positionId)],
              },
              {
                address: posManagerContractAddress,
                abi: Pancakev3PosManagerABI,
                functionName: 'positions',
                args: [BigInt(positionId)],
              },
            ],
          })
          if (multiCallRes2.some((item) => item.status === 'failure')) {
            return
          }
          const [ownerResult, positionResult] = multiCallRes2
          const owner = ownerResult.result
          const [
            ,
            ,
            // _nonce,
            // operator,
            token02,
            token12,
            fee2,
            tickLower,
            tickUpper,
            liquidity2,
            // _feeGrowthInside0LastX128,
            // _feeGrowthInside1LastX128,
            // _tokensOwed0,
            // _tokensOwed1,
          ] = positionResult.result
          if (
            token02.toLowerCase() !== pool2.token0.address.toLowerCase() ||
            token12.toLowerCase() !== pool2.token1.address.toLowerCase() ||
            fee2 !== pool2.fee
          ) {
            setError(`Position ${positionId} does not belong to the pool ${pool2.token0.symbol}-${pool2.token1.symbol}`)
            return
          }
          const position2 = new PancakePosition({
            pool: pool2,
            tickLower,
            tickUpper,
            liquidity: liquidity2.toString(),
          })
          setPosition(position2)
          setPositionOwner(owner)
        }
      }
      setLoading(false)
    }
    getPoolInfo()
  }, [chainId, pool, poolAddress, posManagerContractAddress, positionId, publicClient])
  useEffect3(() => {
    let i
    if (!!pool && publicClient) {
      const getSlot0 = async () => {
        const multiCallRes = await publicClient.multicall({
          contracts: [
            {
              address: poolAddress,
              abi: Pancakev3PoolABI,
              functionName: 'slot0',
            },
            {
              address: poolAddress,
              abi: Pancakev3PoolABI,
              functionName: 'liquidity',
            },
          ],
        })
        const [slot0, liquidity] = [multiCallRes[0].result || [], multiCallRes[1].result]
        const [sqrtPriceX96, tick] = slot0
        if (liquidity === void 0 || sqrtPriceX96 === void 0 || tick === void 0) {
          return
        }
        setPool(new PancakeV3Pool(pool.token0, pool.token1, pool.fee, sqrtPriceX96, liquidity, tick))
      }
      i = setInterval(() => {
        getSlot0()
      }, 15e3)
    }
    return () => {
      i && clearInterval(i)
    }
  }, [pool, poolAddress, publicClient])
  return { loading, pool, position, error, positionOwner }
}

// src/hooks/useWidgetInfo.tsx
import { jsx as jsx7 } from 'react/jsx-runtime'
var WidgetContext = createContext2({
  loading: true,
  pool: null,
  poolAddress: '',
  position: null,
  positionOwner: null,
  theme: defaultTheme,
  onConnectWallet: () => {},
  onAddTokens: () => {},
  onRemoveToken: () => {},
  onAmountChange: () => {},
  onOpenTokenSelectModal: () => {},
  farmContractAddresses: [],
})
var WidgetProvider = ({ poolAddress, children, positionId, ...rest }) => {
  const { loading, pool, position, error, positionOwner } = usePoolInfo(poolAddress, positionId)
  return /* @__PURE__ */ jsx7(WidgetContext.Provider, {
    value: {
      loading,
      poolAddress,
      pool,
      positionId,
      position,
      positionOwner,
      error,
      ...rest,
    },
    children,
  })
}
var useWidgetInfo = () => {
  const context = useContext2(WidgetContext)
  if (context === void 0) {
    throw new Error('useWidgetInfo must be used within a WidgetProvider')
  }
  return context
}

// src/hooks/useTokens.tsx
import {
  createContext as createContext3,
  useCallback as useCallback3,
  useContext as useContext3,
  useEffect as useEffect4,
  useState as useState4,
} from 'react'
import { jsx as jsx8 } from 'react/jsx-runtime'
var TokenListContext = createContext3({
  loading: false,
  allTokens: [],
  getToken: () => Promise.resolve({}),
})
var TokenProvider = ({ children }) => {
  const [loading, setLoading] = useState4(false)
  const [allTokens, setAllTokens] = useState4([])
  const { chainId } = useWeb3Provider()
  const fetchTokenList = useCallback3(() => {
    setLoading(true)
    fetch(`${PATHS.KYBERSWAP_SETTING_API}?page=1&pageSize=100&isWhitelisted=true&chainIds=${chainId}`)
      .then((res) => res.json())
      .then((res) => setAllTokens(res.data.tokens))
      .finally(() => {
        setLoading(false)
      })
  }, [chainId])
  const fetchTokenInfo = useCallback3(
    async (address) => {
      setLoading(true)
      try {
        const res = await fetch(
          `${PATHS.KYBERSWAP_SETTING_API}?query=${address}&page=1&pageSize=100&chainIds=${chainId}`,
        )
        const { data } = await res.json()
        return data.tokens?.[0] || null
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [chainId],
  )
  const getToken = useCallback3(
    async (address) => {
      const whitelistedToken = allTokens.find((token2) => token2.address?.toLowerCase() === address.toLowerCase())
      if (whitelistedToken) return whitelistedToken
      const token = await fetchTokenInfo(address)
      if (token) {
        const allTokensClone = [...allTokens]
        allTokensClone.push(token)
        setAllTokens(allTokensClone)
        return token
      }
      return null
    },
    [allTokens, fetchTokenInfo],
  )
  useEffect4(() => {
    fetchTokenList()
  }, [fetchTokenList])
  return /* @__PURE__ */ jsx8(TokenListContext.Provider, {
    value: {
      loading,
      allTokens,
      getToken,
    },
    children,
  })
}
var useTokens = () => {
  const context = useContext3(TokenListContext)
  if (context === void 0) {
    throw new Error('useTokens must be used within a TokenProvider')
  }
  return context
}

// src/hooks/useMarketPrice.ts
import { useEffect as useEffect6, useMemo, useState as useState6 } from 'react'

// ../hooks/src/use-token-prices.ts
import { useCallback as useCallback4, useEffect as useEffect5, useState as useState5 } from 'react'
var TOKEN_API_URL = 'https://token-api.kyberengineering.io/api'
function useTokenPrices({ addresses, chainId }) {
  const [loading, setLoading] = useState5(false)
  const [prices, setPrices] = useState5(() => {
    return addresses.reduce((acc, address) => {
      return {
        ...acc,
        [address]: { price: 0 },
      }
    }, {})
  })
  const fetchPrices = useCallback4(
    async (_addresses) => {
      const r2 = await fetch(`${TOKEN_API_URL}/v1/public/tokens/prices`, {
        method: 'POST',
        body: JSON.stringify({
          [chainId]: _addresses,
        }),
      }).then((res) => res.json())
      return r2?.data?.[chainId] || {}
    },
    [chainId],
  )
  useEffect5(() => {
    if (addresses.length === 0) {
      setPrices({})
      return
    }
    fetchPrices(addresses)
      .then((prices2) => {
        setPrices(
          addresses.reduce((acc, address) => {
            return {
              ...acc,
              [address]: prices2[address]?.PriceBuy || 0,
            }
          }, {}),
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetchPrices, addresses.join(',')])
  return {
    loading,
    prices,
    fetchPrices,
  }
}

// src/hooks/useMarketPrice.ts
function useMarketPrice({ tokens }) {
  const { chainId } = useWeb3Provider()
  const { fetchPrices } = useTokenPrices({ addresses: [], chainId })
  const [prices, setPrices] = useState6([])
  const tokensAddress = useMemo(
    () =>
      tokens
        .map((token) =>
          token.address?.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase()
            ? token.address
            : NetworkInfo[chainId].wrappedToken.address,
        )
        ?.join(','),
    [chainId, tokens],
  )
  useEffect6(() => {
    const getPrices = () => {
      if (!tokensAddress) return
      fetchPrices(tokensAddress.split(',').map((item) => item.toLowerCase())).then((prices2) => {
        const newPrices = []
        Object.keys(prices2).forEach((key) => {
          newPrices.push({
            address: key,
            price: prices2[key].PriceBuy,
          })
        })
        setPrices(newPrices)
      })
    }
    getPrices()
    const i = setInterval(() => getPrices, 30 * 1e3)
    return () => clearInterval(i)
  }, [fetchPrices, tokensAddress])
  return prices
}

// src/hooks/useTokenBalance.ts
import { useEffect as useEffect7, useCallback as useCallback5, useMemo as useMemo2, useState as useState7 } from 'react'
import { erc20Abi } from 'viem'
function useTokenBalance({ tokens }) {
  const { account, publicClient, chainId } = useWeb3Provider()
  const [balances, setBalances] = useState7([])
  const tokensAddress = useMemo2(
    () =>
      tokens
        .map((token) =>
          token.address?.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase()
            ? token.address
            : NetworkInfo[chainId].wrappedToken.address,
        )
        ?.join(','),
    [chainId, tokens],
  )
  const getNativeTokenBalance = useCallback5(async () => {
    if (!account || !publicClient) return
    const balance = await publicClient.getBalance({
      address: account,
    })
    return balance
  }, [account, publicClient])
  useEffect7(() => {
    const getBalances = () => {
      if (!account || !publicClient || !tokens.length) return
      const contractCalls = tokens.map((token) => ({
        address: token.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account],
      }))
      publicClient
        .multicall({
          contracts: contractCalls,
        })
        .then(async (res) => {
          const newBalances = []
          for (const [index, item] of res.entries()) {
            if (item.status === 'success')
              newBalances.push({
                address: tokens[index].address,
                balance: item.result,
              })
            else if (tokens[index].address?.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
              const balance = await getNativeTokenBalance()
              if (balance)
                newBalances.push({
                  address: tokens[index].address,
                  balance,
                })
            }
          }
          setBalances(newBalances)
        })
    }
    getBalances()
    const i = setInterval(() => getBalances(), 1e4)
    return () => clearInterval(i)
  }, [account, getNativeTokenBalance, publicClient, tokensAddress])
  return balances
}

// src/hooks/useZapInState.tsx
import { tickToPrice } from '@pancakeswap/v3-sdk'

// ../hooks/src/use-debounce.ts
import { useEffect as useEffect8, useState as useState8 } from 'react'
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState8(value)
  useEffect8(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || 500)
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  return debouncedValue
}

// src/hooks/useZapInState.tsx
import { jsx as jsx9 } from 'react/jsx-runtime'
var ZAP_URL = 'https://zap-api.kyberswap.com'
var ERROR_MESSAGE = {
  WRONG_NETWORK: 'Wrong network',
  SELECT_TOKEN_IN: 'Select token in',
  INVALID_TOKENS_AND_AMOUNTS: 'Number of init tokens and amounts must be the same',
  ENTER_MIN_PRICE: 'Enter min price',
  ENTER_MAX_PRICE: 'Enter max price',
  INVALID_PRICE_RANGE: 'Invalid price range',
  ENTER_AMOUNT: 'Enter amount for',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_INPUT_AMOUNTT: 'Invalid input amount',
}
var ZapContext = createContext4({
  revertPrice: false,
  tickLower: null,
  tickUpper: null,
  tokensIn: [],
  amountsIn: '',
  setAmountsIn: () => {},
  toggleRevertPrice: () => {},
  setTick: () => {},
  error: '',
  zapInfo: null,
  loading: false,
  priceLower: null,
  priceUpper: null,
  slippage: 10,
  setSlippage: () => {},
  ttl: 20,
  // 20min
  setTtl: () => {},
  toggleSetting: () => {},
  setShowSeting: () => {},
  showSetting: false,
  degenMode: false,
  setDegenMode: () => {},
  marketPrice: void 0,
  source: '',
})
var ZapContextProvider = ({
  children,
  source,
  excludedSources,
  includedSources,
  initTickLower,
  initTickUpper,
  initDepositTokens,
  initAmounts,
}) => {
  const { pool, poolAddress, position, positionId, feePcm, feeAddress, onAddTokens } = useWidgetInfo()
  const { chainId, networkChainId } = useWeb3Provider()
  const { getToken } = useTokens()
  const [showSetting, setShowSeting] = useState9(false)
  const [slippage, setSlippage] = useState9(10)
  const [ttl, setTtl] = useState9(20)
  const [revertPrice, setRevertPrice] = useState9(false)
  const [tickLower, setTickLower] = useState9(position?.tickLower ?? null)
  const [tickUpper, setTickUpper] = useState9(position?.tickUpper ?? null)
  const [tokensIn, setTokensIn] = useState9([])
  const [amountsIn, setAmountsIn] = useState9(initAmounts)
  const [zapInfo, setZapInfo] = useState9(null)
  const [zapApiError, setZapApiError] = useState9('')
  const [loading, setLoading] = useState9(false)
  const [degenMode, setDegenMode] = useState9(false)
  const [marketPrice, setMarketPrice] = useState9(void 0)
  const debounceTickLower = useDebounce(tickLower, 300)
  const debounceTickUpper = useDebounce(tickUpper, 300)
  const debounceAmountsIn = useDebounce(amountsIn, 300)
  const prices = useMarketPrice({ tokens: tokensIn })
  useEffect9(() => {
    if (prices.length) {
      const tokensInClone = [...tokensIn]
      tokensInClone.forEach((token) => {
        const address =
          token.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
            ? NetworkInfo[chainId].wrappedToken.address.toLowerCase()
            : token.address.toLowerCase()
        const price = prices.find((price2) => price2.address.toLowerCase() === address)
        token.price = price?.price
      })
      setTokensIn(tokensInClone)
    }
  }, [prices, chainId])
  const balances = useTokenBalance({ tokens: tokensIn })
  useEffect9(() => {
    if (balances.length) {
      const tokensInClone = [...tokensIn]
      tokensInClone.forEach((token) => {
        const balance = balances.find((balance2) => balance2.address === token.address)
        token.balance = balance?.balance
      })
      setTokensIn(tokensInClone)
    }
  }, [balances])
  const toggleSetting = () => setShowSeting((prev) => !prev)
  const toggleRevertPrice = useCallback6(() => setRevertPrice((prev) => !prev), [])
  const setTick = useCallback6(
    (type, value) => {
      if (position || (pool && (value > pool.maxTick || value < pool.minTick))) {
        return
      }
      if (type === 'PriceLower' /* PriceLower */) {
        if (revertPrice) setTickUpper(value)
        else setTickLower(value)
      } else {
        if (revertPrice) setTickLower(value)
        else setTickUpper(value)
      }
    },
    [position, pool, revertPrice],
  )
  const tokensInAddress = useMemo3(() => tokensIn.map((token) => token.address?.toLowerCase()).join(','), [tokensIn])
  const priceLower = useMemo3(() => {
    if (!pool || tickLower == null) return null
    return tickToPrice(pool.token0, pool.token1, tickLower)
  }, [pool, tickLower])
  const priceUpper = useMemo3(() => {
    if (!pool || tickUpper === null) return null
    return tickToPrice(pool.token0, pool.token1, tickUpper)
  }, [pool, tickUpper])
  const error = useMemo3(() => {
    const initDepositTokenAddresses = initDepositTokens?.split(',') || []
    const listInitAmounts = initAmounts?.split(',') || []
    if (initDepositTokenAddresses.length !== listInitAmounts.length) return ERROR_MESSAGE.INVALID_TOKENS_AND_AMOUNTS
    if (chainId !== networkChainId) return ERROR_MESSAGE.WRONG_NETWORK
    if (!tokensIn.length) return ERROR_MESSAGE.SELECT_TOKEN_IN
    if (tickLower === null) return ERROR_MESSAGE.ENTER_MIN_PRICE
    if (tickUpper === null) return ERROR_MESSAGE.ENTER_MAX_PRICE
    if (tickLower >= tickUpper) return ERROR_MESSAGE.INVALID_PRICE_RANGE
    const listAmountsIn = debounceAmountsIn.split(',')
    const listTokenEmptyAmount = tokensIn.filter(
      (_, index) => !listAmountsIn[index] || listAmountsIn[index] === '0' || !parseFloat(listAmountsIn[index]),
    )
    if (listTokenEmptyAmount.length)
      return ERROR_MESSAGE.ENTER_AMOUNT + ' ' + listTokenEmptyAmount.map((token) => token.symbol).join(', ')
    try {
      for (let i = 0; i < tokensIn.length; i++) {
        const balance = formatUnits(BigInt(tokensIn[i].balance?.toString() || '0'), tokensIn[i].decimals)
        if (parseFloat(listAmountsIn[i]) > parseFloat(balance)) return ERROR_MESSAGE.INSUFFICIENT_BALANCE
      }
    } catch (e) {
      return ERROR_MESSAGE.INVALID_INPUT_AMOUNTT
    }
    if (zapApiError) return zapApiError
    return ''
  }, [
    initDepositTokens,
    initAmounts,
    chainId,
    networkChainId,
    tokensIn,
    tickLower,
    tickUpper,
    debounceAmountsIn,
    zapApiError,
  ])
  useEffect9(() => {
    if (position?.tickUpper !== void 0 && position.tickLower !== void 0) {
      setTickLower(position.tickLower)
      setTickUpper(position.tickUpper)
    }
  }, [position?.tickUpper, position?.tickLower])
  useEffect9(() => {
    if (!pool) return
    if (initTickLower !== void 0 && initTickLower % pool.tickSpacing === 0 && !tickLower) {
      setTickLower(initTickLower)
    }
    if (initTickUpper !== void 0 && initTickUpper % pool.tickSpacing === 0 && !tickUpper) {
      setTickUpper(initTickUpper)
    }
  }, [pool, initTickUpper, initTickLower, tickLower, tickUpper])
  useEffect9(() => {
    if (!pool) return
    if (tokensInAddress.toLowerCase() === initDepositTokens.toLowerCase()) {
      if (!initDepositTokens) onAddTokens(`${pool.token0.address},${pool.token1.address}`)
      return
    }
    const initDepositTokenAddresses = initDepositTokens?.split(',') || []
    ;(async () => {
      if (initDepositTokens) {
        const listInitTokens = await Promise.all(
          initDepositTokenAddresses.map(async (address) => {
            const token = await getToken(address)
            return token
          }),
        ).then((tokens) => tokens.filter((item) => !!item))
        console.log('set tokens in')
        setTokensIn(listInitTokens)
      }
    })()
  }, [getToken, initAmounts, initDepositTokens, onAddTokens, pool, tokensInAddress])
  useEffect9(() => {
    setAmountsIn(initAmounts)
  }, [initAmounts])
  const { fetchPrices } = useTokenPrices({ addresses: [], chainId })
  useEffect9(() => {
    if (!pool) return
    fetchPrices([pool.token0.address.toLowerCase(), pool.token1.address.toLowerCase()]).then((prices2) => {
      const price0 = prices2?.[pool.token0.address.toLowerCase()].PriceBuy || 0
      const price1 = prices2?.[pool.token1.address.toLowerCase()].PriceBuy || 0
      if (price0 && price1) setMarketPrice(price0 / price1)
      else setMarketPrice(null)
    })
  }, [chainId, pool])
  useEffect9(() => {
    if (
      debounceTickLower !== null &&
      debounceTickUpper !== null &&
      pool &&
      (!error ||
        error === zapApiError ||
        error === ERROR_MESSAGE.INSUFFICIENT_BALANCE ||
        error === ERROR_MESSAGE.WRONG_NETWORK)
    ) {
      let formattedAmountsInWeis = ''
      const listAmountsIn = amountsIn.split(',')
      try {
        formattedAmountsInWeis = tokensIn
          .map((token, index) => parseUnits(listAmountsIn[index] || '0', token.decimals).toString())
          .join(',')
      } catch (error2) {
        console.log(error2)
      }
      if (
        !tokensInAddress ||
        !formattedAmountsInWeis ||
        !formattedAmountsInWeis.length ||
        !formattedAmountsInWeis[0] ||
        formattedAmountsInWeis[0] === '0'
      ) {
        setZapInfo(null)
        return
      }
      setLoading(true)
      const params = {
        dex: 'DEX_9MM_V3',
        'pool.id': poolAddress,
        'pool.token0': pool.token0.address,
        'pool.token1': pool.token1.address,
        'pool.fee': pool.fee,
        'position.tickUpper': debounceTickUpper,
        'position.tickLower': debounceTickLower,
        tokensIn: tokensInAddress,
        amountsIn: formattedAmountsInWeis,
        slippage,
        ...(positionId ? { 'position.id': positionId } : {}),
        ...(feeAddress ? { feeAddress, feePcm } : {}),
        ...(includedSources ? { 'aggregatorOptions.includedSources': includedSources } : {}),
        ...(excludedSources ? { 'aggregatorOptions.excludedSources': excludedSources } : {}),
      }
      let tmp = ''
      Object.keys(params).forEach((key) => {
        tmp = `${tmp}&${key}=${params[key]}`
      })
      fetch(`${ZAP_URL}/${chainIdToChain[chainId]}/api/v1/in/route?${tmp.slice(1)}`, {
        headers: {
          'X-Client-Id': source,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data) {
            setZapApiError('')
            setZapInfo(res.data)
          } else {
            setZapInfo(null)
            setZapApiError(res.message || 'Something went wrong')
          }
        })
        .catch((e) => {
          setZapInfo(null)
          setZapApiError(e.message || 'Something went wrong')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [
    chainId,
    debounceTickLower,
    debounceTickUpper,
    feeAddress,
    feePcm,
    poolAddress,
    pool,
    slippage,
    positionId,
    includedSources,
    excludedSources,
    source,
    tokensInAddress,
    debounceAmountsIn,
    error,
    zapApiError,
  ])
  return /* @__PURE__ */ jsx9(ZapContext.Provider, {
    value: {
      revertPrice,
      tickLower,
      tickUpper,
      tokensIn,
      amountsIn,
      setAmountsIn,
      toggleRevertPrice,
      setTick,
      error,
      zapInfo,
      loading,
      priceLower,
      priceUpper,
      slippage,
      setSlippage,
      ttl,
      setTtl,
      toggleSetting,
      setShowSeting,
      showSetting,
      positionId,
      degenMode,
      setDegenMode,
      marketPrice,
      source,
    },
    children,
  })
}
var useZapState = () => {
  const context = useContext4(ZapContext)
  if (context === void 0) {
    throw new Error('useZapState must be used within a ZapContextProvider')
  }
  return context
}

// src/assets/alert.svg
import * as React2 from 'react'
import { jsx as jsx10, jsxs as jsxs2 } from 'react/jsx-runtime'
var SvgAlert = (props) =>
  /* @__PURE__ */ jsxs2('svg', {
    width: 25,
    height: 24,
    viewBox: '0 0 25 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: [
      /* @__PURE__ */ jsx10('path', {
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        d: 'M15.607 4.73317L21.0374 13.9333C22.3729 16.1998 20.6576 19 17.9289 19H7.07003C4.34316 19 2.62604 16.2015 3.96337 13.935L9.39373 4.73488C10.7545 2.42199 14.2427 2.42199 15.607 4.73317Z',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
      /* @__PURE__ */ jsx10('path', {
        d: 'M12.5 11V8',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
      /* @__PURE__ */ jsx10('path', {
        d: 'M12.499 14.82C12.399 14.82 12.319 14.902 12.321 15C12.321 15.1 12.403 15.18 12.501 15.18C12.599 15.18 12.679 15.098 12.679 15C12.679 14.902 12.599 14.82 12.499 14.82',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
    ],
  })
var alert_default = SvgAlert

// src/components/Setting/SlippageInput.tsx
import { Fragment as Fragment4, jsx as jsx11, jsxs as jsxs3 } from 'react/jsx-runtime'
var parseSlippageInput = (str) => Math.round(Number.parseFloat(str) * 100)
var validateSlippageInput = (str) => {
  if (str === '') {
    return {
      isValid: true,
    }
  }
  const numberRegex = /^(\d+)\.?(\d{1,2})?$/
  if (!str.match(numberRegex)) {
    return {
      isValid: false,
      message: `Enter a valid slippage percentage`,
    }
  }
  const rawSlippage = parseSlippageInput(str)
  if (Number.isNaN(rawSlippage)) {
    return {
      isValid: false,
      message: `Enter a valid slippage percentage`,
    }
  }
  if (rawSlippage < 0) {
    return {
      isValid: false,
      message: `Enter a valid slippage percentage`,
    }
  } else if (rawSlippage < 50) {
    return {
      isValid: true,
      message: `Your transaction may fail`,
    }
  } else if (rawSlippage > 5e3) {
    return {
      isValid: false,
      message: `Enter a smaller slippage percentage`,
    }
  } else if (rawSlippage > 500) {
    return {
      isValid: true,
      message: `Your transaction may be frontrun`,
    }
  }
  return {
    isValid: true,
  }
}
var SlippageInput = () => {
  const { slippage, setSlippage } = useZapState()
  const [v, setV] = useState10(() => {
    if ([5, 10, 50, 100].includes(slippage)) return ''
    return ((slippage * 100) / 1e4).toString()
  })
  const { isValid, message } = validateSlippageInput(v)
  const handleCustomSlippageChange = (e) => {
    const value = e.target.value
    if (value === '') {
      setV(value)
      setSlippage(10)
      return
    }
    const numberRegex = /^(\d+)\.?(\d{1,2})?$/
    if (!value.match(numberRegex)) {
      e.preventDefault()
      return
    }
    const res = validateSlippageInput(value)
    if (res.isValid) {
      const parsedValue = parseSlippageInput(value)
      setSlippage(parsedValue)
    } else setSlippage(10)
    setV(value)
  }
  const onCustomSlippageBlur = (e) => {
    if (!e.currentTarget.value) setSlippage(10)
    else if (isValid) setSlippage(parseSlippageInput(e.currentTarget.value))
  }
  return /* @__PURE__ */ jsxs3(Fragment4, {
    children: [
      /* @__PURE__ */ jsxs3('div', {
        className: 'flex gap-2 w-full',
        children: [
          /* @__PURE__ */ jsx11('div', {
            className: 'rounded-md mt-[10px] bg-inputBackground border border-inputBackground flex flex-1 h-10',
            style: { boxShadow: '0 2px 0 -1px #0000000f inset' },
            children: [5, 10, 50, 100].map((item) =>
              /* @__PURE__ */ jsxs3(
                'div',
                {
                  className:
                    "rounded-[15px] text-subText text-sm px-[6px] font-semibold flex flex-1 border border-transparent items-center gap-2 justify-center cursor-pointer box-border data-[active='true']:text-textReverse data-[active='true']:bg-textSecondary",
                  'data-active': item === slippage,
                  role: 'button',
                  onClick: () => setSlippage(item),
                  children: [(item * 100) / 1e4, '%'],
                },
                item,
              ),
            ),
          }),
          /* @__PURE__ */ jsx11('div', {
            className:
              "rounded-md mt-[10px] bg-inputBackground border border-inputBackground h-10 flex flex-1 w-[100px] data-[error='true']:border-[var(--ks-lw-error)] data-[warning='true']:border-warning",
            style: { boxShadow: '0 2px 0 -1px #0000000f inset' },
            'data-error': !!message && !isValid,
            'data-warning': !!message && isValid,
            children: /* @__PURE__ */ jsxs3('div', {
              className:
                'relative rounded-[15px] text-subText text-sm px-[6px] font-semibold flex flex-1 border border-transparent items-center gap-2 justify-center cursor-pointer box-border w-[72px]',
              children: [
                message &&
                  /* @__PURE__ */ jsx11(alert_default, {
                    className: cn(
                      'absolute top-2 left-1 w-4 h-3',
                      isValid ? 'text-warning' : 'text-[var(--ks-lw-error)]',
                    ),
                  }),
                /* @__PURE__ */ jsx11('input', {
                  className:
                    'bg-inputBackground text-[var(--ks-lw-text)] font-semibold border-none outline-none text-right w-full text-base p-0',
                  placeholder: 'Custom',
                  onBlur: onCustomSlippageBlur,
                  onChange: handleCustomSlippageChange,
                  pattern: '/^(\\d+)\\.?(\\d{1,2})?$/',
                  value: v,
                }),
                /* @__PURE__ */ jsx11('span', { children: '%' }),
              ],
            }),
          }),
        ],
      }),
      message &&
        /* @__PURE__ */ jsx11('div', {
          className: cn('text-xs text-left mt-1', isValid ? 'text-warning' : 'text-[var(--ks-lw-error)]'),
          children: message,
        }),
    ],
  })
}
var SlippageInput_default = SlippageInput

// src/hooks/useOnClickOutside.ts
import { useEffect as useEffect10, useRef as useRef4 } from 'react'
function useOnClickOutside(node, handler) {
  const handlerRef = useRef4(handler)
  handlerRef.current = handler
  useEffect10(() => {
    const handleClickOutside = (e) => {
      let nodes
      if (
        [...document.getElementsByClassName('setting'), ...document.getElementsByClassName('ks-lw-modal-overlay')].some(
          (el) => el.contains(e.target),
        )
      ) {
        return
      }
      if ([...document.getElementsByTagName('kyber-portal')].some((el) => el.contains(e.target))) {
        return
      }
      if (Array.isArray(node)) nodes = node
      else nodes = [node]
      if (nodes.some((node2) => node2.current?.contains(e.target) ?? false)) {
        return
      }
      handlerRef.current?.()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [node])
}

// src/assets/x.svg
import * as React3 from 'react'
import { jsx as jsx12, jsxs as jsxs4 } from 'react/jsx-runtime'
var SvgX = (props) =>
  /* @__PURE__ */ jsxs4('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'feather feather-x',
    ...props,
    children: [
      /* @__PURE__ */ jsx12('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
      /* @__PURE__ */ jsx12('line', { x1: 6, y1: 6, x2: 18, y2: 18 }),
    ],
  })
var x_default = SvgX

// src/components/Setting/index.tsx
import { Fragment as Fragment5, jsx as jsx13, jsxs as jsxs5 } from 'react/jsx-runtime'
function Setting() {
  const { showSetting, ttl, setTtl, toggleSetting, degenMode, setDegenMode } = useZapState()
  const ref = useRef5(null)
  const [showConfirm, setShowConfirm] = useState11(false)
  const [confirm, setConfirm] = useState11('')
  useOnClickOutside(ref, () => {
    if (showSetting) toggleSetting()
  })
  if (!showSetting) return null
  return /* @__PURE__ */ jsxs5(Fragment5, {
    children: [
      /* @__PURE__ */ jsx13(Modal_default, {
        isOpen: showConfirm,
        children: /* @__PURE__ */ jsxs5('div', {
          children: [
            /* @__PURE__ */ jsxs5('div', {
              className: 'flex justify-between text-xl items-center font-semibold',
              children: [
                /* @__PURE__ */ jsx13('div', { children: 'Are you sure?' }),
                /* @__PURE__ */ jsx13(x_default, {
                  className: 'cursor-pointer',
                  role: 'button',
                  onClick: () => setShowConfirm(false),
                }),
              ],
            }),
            /* @__PURE__ */ jsx13('div', {
              className: 'text-sm text-subText mt-5',
              children:
                'Turn this on to make trades with very high price impact or to set very high slippage tolerance. This can result in bad rates and loss of funds. Be cautious.',
            }),
            /* @__PURE__ */ jsxs5('div', {
              className: 'text-sm text-subText mt-5',
              children: [
                'Please type the word ',
                /* @__PURE__ */ jsx13('span', { className: 'text-warning', children: 'Confirm' }),
                ' ',
                'below to enable Degen Mode',
              ],
            }),
            /* @__PURE__ */ jsx13(Input, {
              className: 'box-border mt-5 py-2 px-4 text-sm outline-none border-none w-full',
              placeholder: 'Confirm',
              value: confirm,
              onChange: (e) => {
                setConfirm(e.target.value.trim())
              },
            }),
            /* @__PURE__ */ jsxs5('div', {
              className: 'flex gap-1 mt-6',
              children: [
                /* @__PURE__ */ jsx13('button', {
                  className: 'ks-outline-btn flex-1',
                  onClick: () => {
                    setShowConfirm(false)
                    setConfirm('')
                  },
                  children: 'No, Go back',
                }),
                /* @__PURE__ */ jsx13('button', {
                  className: 'ks-primary-btn flex-1',
                  onClick: () => {
                    if (confirm.toLowerCase() === 'confirm') {
                      setDegenMode(true)
                      setShowConfirm(false)
                      setConfirm('')
                    }
                  },
                  children: 'Confirm',
                }),
              ],
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxs5('div', {
        className:
          'absolute w-[360px] right-6 top-[136px] bg-cardBackground p-4 rounded-3xl border border-cardBorder border-b-2',
        style: { boxShadow: '0px 4px 8px 0px #00000029' },
        ref,
        children: [
          /* @__PURE__ */ jsx13('div', { className: 'text-xl font-semibold mb-5', children: 'Advanced Setting' }),
          /* @__PURE__ */ jsx13(MouseoverTooltip, {
            text: 'Applied to each zap step. Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Please use with caution!',
            width: '220px',
            children: /* @__PURE__ */ jsx13('div', {
              className: 'text-sm border-b border-dotted border-textSecondary',
              children: 'Max Slippage',
            }),
          }),
          /* @__PURE__ */ jsx13(SlippageInput_default, {}),
          /* @__PURE__ */ jsxs5('div', {
            className: 'flex justify-between items-center mt-[14px]',
            children: [
              /* @__PURE__ */ jsx13(MouseoverTooltip, {
                text: 'Transaction will revert if it is pending for longer than the indicated time.',
                width: '220px',
                children: /* @__PURE__ */ jsx13('div', {
                  className: 'text-sm border-b border-dotted border-textSecondary',
                  children: 'Transaction Time Limit',
                }),
              }),
              /* @__PURE__ */ jsxs5('div', {
                className:
                  'flex py-[6px] px-2 gap-1 rounded-full bg-transparent text-[var(--ks-lw-text)] text-xs font-medium text-right',
                children: [
                  /* @__PURE__ */ jsx13('input', {
                    className: 'border-none outline-none w-12 p-0 bg-transparent text-right text-[var(--ks-lw-text)]',
                    maxLength: 5,
                    placeholder: '20',
                    value: ttl ? ttl.toString() : '',
                    onChange: (e) => {
                      const v = +e.target.value
                        .trim()
                        .replace(/[^0-9.]/g, '')
                        .replace(/(\..*?)\..*/g, '$1')
                        .replace(/^0[^.]/, '0')
                      setTtl(v)
                    },
                  }),
                  /* @__PURE__ */ jsx13('span', { children: 'mins' }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxs5('div', {
            className: 'flex justify-between items-center mt-[14px]',
            children: [
              /* @__PURE__ */ jsx13(MouseoverTooltip, {
                text: 'Turn this on to make trades with very high price impact or to set very high slippage tolerance. This can result in bad rates and loss of funds. Be cautious.',
                width: '220px',
                children: /* @__PURE__ */ jsx13('div', {
                  className: 'text-sm border-b border-dotted border-textSecondary',
                  children: 'Degen Mode',
                }),
              }),
              /* @__PURE__ */ jsx13(Toggle_default, {
                isActive: degenMode,
                toggle: () => {
                  if (!degenMode) setShowConfirm(true)
                  else setDegenMode(false)
                },
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

// src/components/Content/index.tsx
import {
  useEffect as useEffect18,
  useMemo as useMemo12,
  useState as useState20,
  useCallback as useCallback13,
} from 'react'
import { parseUnits as parseUnits2 } from 'viem'

// src/hooks/useApprovals.ts
import { useCallback as useCallback7, useEffect as useEffect11, useState as useState12 } from 'react'
import { erc20Abi as erc20Abi2 } from 'viem'

// src/utils/index.tsx
import { isAddress as _isAddress, getAddress, formatUnits as formatUnits2 } from 'viem'

// src/assets/9mm.png
var mm_default =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAi8AAAIvCAYAAAC81DtEAAAgAElEQVR4nOzBAQ0AAADCoPdPbQ43IACAG9UAAAD//xrFo2AUjIJRMApGwSgYOoCBgQEAAAD//+zRQREAIBADseAKV9hAIHaYwwEP+DYKdtp2q62qvBkRvzoGNiZWFo2IZzgAAAD//+zWIQEAIAADwStCBaqQglpIKtGAHHgcArcL8GJqOS8R8UNFR0O5+gsDEzvrR8QTHAAAAP//7NYxAYAwAMTAU4KmWqsHNsxUQ5VUAgyMOQFZfvnOS5I/DUxcH5sLD27slkjyCgcAAP//Gm28jIJRMAooBd4MDAxBUCxAgVknGRgYNjAwMCxnYGB4OBoro2AUjAKsgIGBAQAAAP//Gm28jIJRMArIAVoMDAyZDAwMMRQ2WLABUMGzh4GBYTa0MfN7NIZGwSgYBXDAwMAAAAAA//8abbyMglEwCogF/NDGSjwDA4MpnULtPQMDw2IGBoY5DAwMl0djahSMglHAwMDAAAAAAP//Gm28jIJRMAoIATcGBoY4BgaG6AEOqXPQtTGgNTJPBtgto2AUjIKBAgwMDAAAAAD//xptvIyCUTAK0AE7tMESzMDA4MvAwCA0yEIIVDCdYmBgWAttyDwYBG4aBaNgFNALMDAwAAAAAP//Gm28jIJRMApgwAU6JQRaeMs1hEIFtNB3PgMDwwoGBoaPg8A9o2AUjAJaAgYGBgAAAAD//xptvIyCUTCygTwDA0MStNEiP8RD4jsDA8N6aENmL3SEZhSMglEw3AADAwMAAAD//xptvIyCUTDyACcDA0MoAwNDAgMDg+Mw9f1jBgaGBdAdS48HgXtGwSgYBdQCDAwMAAAAAP//Gm28jIJRMHKAGXSUJZKBgYFvhPgaVIjtY2BgmMvAwLCOgYHh5yBw0ygYBaOAEsDAwAAAAAD//xptvIyCUTC8gQR0e3Mi9GyWkQw+QQ/AA11LcGg03Y+CUTBEAQMDAwAAAP//Gm28jIJRMPwAP3RaKIqBgcGegYGBaTSOMcAjaENm6ej5MaNgFAwxwMDAAAAAAP//Gm28jIJRMHxAGLTB4j8apySBG9CD8BaNnh8zCkbBEAAMDAwAAAAA//8abbyMglEwtIEN9AC5UBoc0z/SwD8GBob90EYM6AyZryM9QEbBKBiUgIGBAQAAAP//Gm28jIJRMPSAPHQNSywDA4PSaPzRBHyFbrteCF3w+28Y+nEUjIKhCRgYGAAAAAD//xptvIyCUTA0gAgDA0MEFFuPxhldwXPoAXgroQfijYJRMAoGEjAwMAAAAAD//xptvIyCUTB4AS/0iH7Q1mZnBgYG5tG4GnBwF9qQAS30vT7Cw2IUjIKBAQwMDAAAAAD//xptvIyCUTD4QBi0wRIwGjeDGlyB7lgaXeg7CkYBPQEDAwMAAAD//xptvIyCUTDwAJQPbaFrWEKhW51HwdABoPUwB6CNmDWjC31HwSigMWBgYAAAAAD//xptvIyCUTBwQBFp4a3CaDwMC/ANutAX1JDZM7rQdxSMAhoABgYGAAAAAP//Gm28jIJRQF8gBD2LBYQtR8N+WIPn0EbMHAYGhjsjPTBGwSigGmBgYAAAAAD//xptvIyCUUB7wA1dvwJqsLgxMDCwjIb5iAOHofcrrYaOzoyCUTAKyAUMDAwAAAAA//8abbyMglFAGwBqoHggnXjLNRrOo4CBgeEzdJEvqCFzajRARsEoIAMwMDAAAAAA//8abbyMglFAXWDCwMCQAG20CI6G7SjAA65Bt1yDGjP3RwNqFIwCIgEDAwMAAAD//xptvIyCUUA5EEO6uVlniIfnC+ipsg8YGBimDwL34AIvGRgYyqAH9oUPgx1aJ6Hnx6yAxsEoGAWjABdgYGAAAAAA//8avW12FIwC8gArAwNDIAMDwyYGBoanDAwMvUO44fIVOgLgzsDAIMnAwFDBwMDgQmU7QItWz1DRPHEGBgYJBgaGdKibQScPb6ei+fQG5gwMDP3QtAS6XykNurh7FIyCUYAOGBgYAAAAAP//Gh15GQWjgDRgzMDAEA8daRnK00L/oXf2YLuEENSI2UFFuz4xMDBoMjAwKDMwMByiormfoQ3GR0hiYtApu+RhMAoGApuhDcuVg8Ato2AUDA7AwMAAAAAA//8abbyMglFAGIhBGyxxw6BCBK2tmMfAwLCYgYHhIRZ5ZujJsRpUtBM0OjILyp4DbVhQC6yAnkaMDehD4y0WejfUUAZvGRgYlkGn9M4Ocb+MglFAGWBgYAAAAAD//xptvIyCUYAdsEOnhUCVn+sQv1foC/TgtAXQKQl8GRvU0JhBRbuvQRt8MDtBDcF70O3j1AKg83JO4DGLDbrjKxEal0N9q/pVaCMGhF8NAveMglFAX8DAwAAAAAD//xptvIyCUYAKYMf0g3rzPEM4bH5C14Cshk49fCZCjyi0YhSlojucoA0mZFDLwMDQREU7TpBw4J84tEGaysDAoEJFNwwU2I00rfRjGPhnFIwCwoCBgQEAAAD//xptvIyCUcDAII90TL/SEA4P0OFnu0hssCAD0O6iDCq6ZysDA4MPFnEO6JSVGBXtSoCORJAC7BgYGFIYGBhCGBgYOKnoloEAn6Hxvgi6rmi08B4FwxcwMDAAAAAA//8abbyMgpEKeKE7VOKh222HMngFPfRsNgXnhWgxMDCcg06XUQP8ha6bwXUsfjJ0/Qu1wGvoSMonMszjhk4rRUGnldio6K6BAKBt7kuga5tGz48ZBcMPMDAwAAAAAP//Gm28jIKRBnygO4XCh7i//0OnDEALYTcyMDD8odC87dATgakFJjMwMOThMYsR2lgyoKKdHQwMDJUUmiEIHYkBNWTsoe4cyuA4dKEvaIH2xyHul1EwCiCAgYEBAAAA//8abbyMgpEADKAjLJHQNQ9DGVyBjlgsp+JiTQtoJUct8AY6/UZo2sqcwEJbUsEP6BQgtcJFBbrDLAZ6A/hQBqA1UFug00rbqNDYHQWjYOAAAwMDAAAA//8abbyMguEKxKAVDwjrDnE/voD2nkEVz0UamH8c2oChFkiGTlkQAxZDGwfUAqCdUpk0CCNraFqKhE45DmXwGrrFfHTb9SgYmoCBgQEAAAD//xptvIyC4QRAR8SHQqeEqH1CLL3BC+jhcaBK5igNF2CGQ+2gFrjAwMBgSIJZUgwMDLepeHHlX+hI2xUq+gkZgLZZO0MbMUHDoCFzHdqImT+67XoUDBnAwMAAAAAA//8abbyMgqEOeKDnsYQPg8WW7xkYGNZAGxMHGBgY/tHYPtDi3JvQqRZqAQvoPT2kgDoGBoZGKroBdDqwJxXNwwVAu6a8oQu/Pal8dg29wV/oGqqF0DOBfg5hv4yC4Q4YGBgAAAAA//8abbyMgqEIQL10P2iDxQNaiQxV8A9a2S6CLryl51kd9QwMDA1UNG8ltCInFbBDD66ToqJbAqDhSS8gBE2P8dC1PEMZgBb2roI2ZI4Ocb+MguEIGBgYAAAAAP//Gm28jIKhAhihuz8SoLtBhnIvlwE6rbEIesDYswGwXxY6XUOtrdE/oYtan5OpPwoaFtQCoPuO1AZoBEEFemZQIjSchzK4Dx0JBC0QvzzE/TIKhgtgYGAAAAAA//8abbyMgsEO5KENlvhhsOMDVhEso+GaDGLBcjJHSXAB0Km5LRSacYLKoxag27E7qWgeOcAC2jALhd6CPZTBNWi6WYHn/J5RMApoDxgYGAAAAAD//xptvIyCwQi4oKMroEaL4xCPoTfQxsoyMtaC0Ao4Qm+UphZ4zMDAoEqFUQ4D6Nkv1Dpb5SfUXY+pZB4lgAka7rCGzFBf6HsWaUTm6SBwzygYSYCBgQEAAAD//xptvIyCwQJAFx+6Qwt3/yF+r9Av6NH4CwbhmRrs0O3W6lQ0E7RgegOVzJoFvXeIWmAD1H2DCXBC3ZQIbdAM5Us//0GvI1gKvZ5g9CC8UUB7wMDAAAAAAP//Gm28jIKBBlbQBksYlS8EHAhwAXpMP2iU5d0gdSO1F+keZGBgcKCiebS4dZrei3dJAdLQ82OShsFFkb+gjfWl0Lu1RncsjQLaAAYGBgAAAAD//xptvIyCgQAa0IPJQIsa5YZ4DLyCDp0vgDZeBjOg9iJdUAGhA10LQU1QTYX1M8iAWtNatAY20NGYYOiZRUMZfIFu+19M5SnKUTAKGBgYGBgAAAAA//8abbyMAnoBIWiDBdTLNB7iof4D2rNcBN3mPFSOWqf2It0F0MqW2oADuiBUmormDobFu8QCTujUKWiRuht0vcxQBo+hF0WC0sutIe6XUTAYAAMDAwAAAP//Gm28jAJaAnboeSxx0PNYWIZ4aB+GNlhWkXl78UAC0K3RV6lo/3cGBgZlCrZGEwIx0F47tcAn6OjLUDtFVgpplFJnELiHUnAG6YiAwTq1OgoGO2BgYAAAAAD//xptvIwCWgAraK8xaogvvGWAbm9eCO053h0E7iEXUPvW6DIGBoZuGrv5CPROIWqBCQwMDIU0djMtgR60ERMzDLZdM0AvilwAvQZjFIwC4gEDAwMAAAD//xptvIwCagEx6NbmROialqEM3kO3gS6m8m3LAwXcodNb1AI3oZdd/qaxfzSg5+FQazcOaLpPk4GB4QGVzBsowAS9XykWer/SUD+w8RU0r82Gpq1RMArwAwYGBgAAAAD//xptvIwCSgBoGsgX2mDxHOLTQr+gPcHF0B0TvwaBm6gBaLE1GjQacoxO7p/EwMCQS0XzBuPWaUoAN7QBEwtt0Az19TEnoTeSg9ZnfR4E7hkFgxEwMDAAAAAA//8abbyMAnKAEQMDQzR0+FpsCIfgf+jdLUug61jeDwI3URuUMzAwdFDRTHLvLyIX8EC3TlNzG/1g3jpNCRCFxg0oX5oNXW/AwXJoZ2L7IHHPKBgsgIGBAQAAAP//Gm28jAJigRh0HUvcMFg4CNrxMB96HsujQeAeWgFZ6CJdap3mCtpqrDQAdzFlMjAwTKOieUNl6zQlAHYcQdQwuFbjBXSBL2ih76VB4J5RMNCAgYEBAAAA//8abbyMAnyAG9pLBTVaXId4SL2ArmNZAj3afCSA9dD4oxYAjeBUDkC4gda83KDyIW6gg/oaqWjeYAaW0IZMJAMDg+AQ98sN6EGQo9cSjGTAwMAAAAAA//8abbyMAnTAAt2VEgXd5jyUFwN+he5kADVY9kKPMh8pgNqLdF8zMDAoMDAwfBug8POErkWiFhhM9x7RC7AxMDB4QRsy3tDzdIYq+Ac93Xkp9DC80WsJRhJgYGAAAAAA//8abbyMAhiwgU4JhQzx3tkfaENlCXTk4esgcBO9ATN0eF2LivZmMDAwzBxgfx1gYGCwp6J5K6CjESMR8EFP8o2B3q9ErcswBwpsgOb50W3XIwEwMDAAAAAA//8abbyMbGDCwMAQDr1XaKgf038Rurhv+QCsyRhsIJ2BgWEGFd10CXrj80AXCFpQt1DzIkN67pwarEAO2ogBTQ+rDXG/vIU2YkBTS5cHgXtGAS0AAwMDAAAA//8abbyMPKAHbbCEQ09IHcrgMbTBshg6Fz4KID3qO1TenQPauXJ6kIRtPwMDQwEVzTtG5YPwhjowgW67Bk0biwxxv5xFuih1dFppOAEGBgYAAAAA//8abbyMDCACLZASoYeLDWXwFbqteRF0zns0kaICat8avQy6LX6wAF7oScfUbJxFQLeAjwIEgK19A43G+Azx9TGg9U27GBgYVkO3yA+1qz1GATpgYGAAAAAA//8abbwMbwA6QC4ZesnbUAagxXn7oQ2WtSN0HQsxQBQ66sJHJfO+QXf40Or+InIBKE3PoaJ5D6D+/EtfbwwZwAedWo6Hro0b6mAbdHp5A/T261Ew1AADAwMAAAD//xptvAw/ADr+PGUYHCDHAD2PZQ50R8FIX8dCDJgPvaKBWqCSygfcUROchR6WSC0wlG6dHkigAl3YHzMMzo/5Bt2pNH90FHeIAQYGBgAAAAD//xptvAwPIAAd2gf1SA2HuI8+QguUBdCL+UYBccCUgYHhFBXD6hG0oqL1/UXkAgsq3zv1GboG7DV9vTFkASN0l1Ii9CyhoX4B6yPoBazzhsHdV8MfMDAwAAAAAP//Gm28DF3ADD3LIxF6HgvbEPYLKKHtgTZYQNubvw8CNw0lwAytyE2p6OZA6LD6YAYroAvPqQUWQPPTKCAN8ECPWACFnd0QD7v/0ClqUCNm3WhZNEgBAwMDAAAA//8abbwMPeAIbayA5qClhrhfLkAXhK4YYYeFURtQe2v0ISqfp0IrIAW994idiuZbQC8HHAXkASXo2TkRw+AakW/Q9TGgRvzm0YW+gwgwMDAAAAAA//8abbwMDQC6EThvmBzvfR+68Hb56PX3VAGgnWTXqbit9S90O/21AfYXsaCJgYGhlormnYRunR5dvEs50IVuuY6G3rM11AFoZK5v9PyYQQAYGBgAAAAA//8abbwMXsAHHRKPhI62DGXwArq9edlor5bqYDr09FtqgZlUNo/WgBO6dVqSivYMhtOEhxNghO5SioJOLw3182POQ3c9ToKulRoF9AYMDAwAAAAA//8abbwMXkDtSone4Bd0yBU0yrIVyh8F1AXUPnH2E/T+ovdDLJ6SoIeRUQu8hi5WHp0moD7ghB7dEAe97JVlCPtlMnREfBTQGzAwMAAAAAD//xptvAxOYMXAwHB0iLr9OPTEW9ChX+8GgXuGM9gOPUiMWmCobhdmgl4PQc01FgN1g/ZIAmLQkeWUIbw+xmQE3VI/eAADAwMAAAD//xptvAw+AIqTc9C7ZIYKOANddLtqdOEt3QC1b41+CL1lebBujSYEQFOr+6ho3k/oWrOHtHHuKEADFtBGDGhaiX8IBc4JBgYGy0HgjpEFGBgYAAAAAP//Gm28DD5A7dNDaQWuQI/bXgE9TG4U0A/Q4tbo4XBE/hYGBgZvKpq3AbplfBTQD3BCGzApQ2jb9ej1EvQGDAwMAAAAAP//Gm28DC7AAe3pDdaTcd9DGywLR2/iHVCQz8DAMIGKDjg6TI59V6fBBZ2gabmdVDZzFBAHxKEH4AUzMDA4MDAwsA7ScLsPHbUc3aFGL8DAwAAAAAD//xptvAwuUM3AwNAyyNz0B7rgdhG0Zzu68HZgAej+oqtUvJgQVOBqD6Nt66A1O2VUNO8adOv4aMU0sEAAeldbEAMDgyeVz/ahBshlYGCYMsTCdOgCBgYGAAAAAP//Gm28DB4gBD2imnuQuOgVdAfHbGjPYhQMDkDtXWgTGRgYCoZR3HJBL6cc3To9fAHoILxUBgaGNGi5ORgAaHOC3OilsXQCDAwMAAAAAP//Gm28DB4AarVnD7BrQBG+m4GBYRb06vg/gymARgHVt0a/gVYEw+2sijAqr0EY3To9OAE7dEopfZCsj2lmYGCoGwTuGP6AgYEBAAAA//8abbwMDqABXQBLrUqJFPATuuV2NfQI7NFDlwYvoPbW6FgGBoYlwy2QoOAI9KRcagHQGqPCgfbUKMAJeKHTSqEDOK30E9oZGL0Bn9aAgYEBAAAA//8abbwMDkDtgpYYcBx63PVK6E3Oo2BwA38qX5R4Ero9dbgCao9SDbVrE0Yy4IfuAAIdXmhG53BYCbV7FNASMDAwAAAAAP//Gm28DDwIgN6kTA/wFHpE/4LRQnhIAXbodnQ5KjraEHox5nAGUxkYGLKo6L8d0F79KBg6QAvaiIml4y5OmyF8yOjQAAwMDAAAAAD//xptvAwsAFVKt2l8adkP6NXui6DrWf4NhYAZBSigHHriK7UAqPGaOAKCGHSJ6QPoPWHUAqNbp4cmYIJeRxAPPbuHg4a+AI34GY3uUKMhYGBgAAAAAP//Gm28DCxogW6PpgU4DG2wrBpdaDikAegSu3vQOX1qgG/Q+4tej5DwA+2k6qeiedegFdNPKpo5CugL+KCLuuNpeL5RHvTuo1FAC8DAwAAAAAD//xptvAwcUIIeqEXNg5f2MDAwHGBgYFgK7XGOgqEP5kKHvakFKqk8ijPYATM0n6lQ0Z0lDAwMvcMzuEYcUIbmrxQqTyt9hpbxb0Z6ANMEMDAwAAAAAP//Gm28DBzYB72PhVpgDvTsg1EwfIARlS99ewStxIfq/UXkAm/oAYvUAh+g4fh2yIXEKMAHZkMbMdQCoJPIE0ZDnAaAgYEBAAAA//8abbwMDKD2Il1Q615ztJU/7MApBgYGUyp6Khi6/mkkAtCIpD0V/T2DgYEhc4SG5XAFoFOr71JxipYBuqPv5EgPWKoDBgYGAAAAAP//Yhpm/hkKALRIdxKV3Vkz2nAZdiCcyg2XQyO44cIA3XVEzQWUqcN8q/lIBKB1YLVU9veMkR6oNAEMDAwAAAAA//8abbzQH5RQeXfRmSFyC/UoIB6Aen7dVAyv/6OjBOCFttSsSJipfDnmKBgcAHTS+WkqusRgdOqIBoCBgQEAAAD//xqdNqIvkITeu8JFRVtBt60eHAqeHwVEg3YGBoYKKgbXTCrfhzRUAS22TkdQ+SqCUTDwwB46zUgt8Bq6MHj09HJqAQYGBgAAAAD//xodeaEv6KNyw2XHaMNl2AFZKh9D/xm6w2gUMDC8Z2BgqKdyOHRReY3EKBh4cBBatlILiNJgOmpkAwYGBgAAAAD//xptvNAPWFD52GjQ/H3pYPf0KCAZdFH5XpZGaKU9CiBgMnT0k1oAdOpx1WjYDjtQRuU1UgXQ85VGATUAAwMDAAAA//8abbzQD0yjsk2zoZc5joLhA5yp3MC9Q4PF4UMdgCqkIir7oZDKVzeMgoEHl6FlLLUAK5XXsY1swMDAAAAAAP//Gl3zQh8QCb1TiFpg9ACk4QeYoY1RDSr6DHSZ46aRHrA4ALW3Tq+A5vNRMHyAKLQDQM01UqALeI+NphEKAQMDAwAAAP//Gh15oT0ATQH0UNmW2tGGy7ADGVRuuBwabbjgBVnQXVjUAhHQxfOjYPgA0ELbJir7ZvTKAGoABgYGAAAAAP//Gh15oT0ALZZso6ItoKPOdUYv/RpWAHR/0XUoTQ3wF5pGboz0gCUAqH3rNGg7tt5o3hxWANT5PAe9nZpaIIqBgWH5SA9YigADAwMAAAD//xodeaEtEKXBYj5qH7Y1CgYeNFOx4cIA7d2NNlwIgxoqL2bWovLx8qNg4MFP6CWL1AQj6W4x2gAGBgYAAAAA//8abbzQFnQyMDDwUNEG0Lz6/sHo0VFANtCg8p1UoOnEutHoIAq8p0HnohnaaRkFwwfshZa91AJy0IbzKCAXMDAwAAAAAP//Gp02oh0ADR9fpKLpoEW62gwMDI8Hm0dHAUVgOwMDgwcVgzCRgYFhwWiUEA0YodMCBlQ0c/Teo+EHQOcvXaXimT7foJd7Ph/pAUsWYGBgAAAAAP//Gh15oR2g9pH9raMNl2EH/KnccDk12nAhGYB6aNlUNjOVymskRsHAg8fQMphagAt6aOkoIAcwMDAAAAAA//8aHXmhDQDdZTGfiiY/YmBgUIPOv46C4QFACwFvU/meK0MGBoYLo+mDLLCcymfsgE5o9aSj+0cB7QEoz95kYGCQp6JNo7dOkwMYGBgAAAAA//8aHXmhPqD2pXoM0NMeRxsuwwsUULnhsmi04UIRKKZyHvOAjqyNguEDQOmjnMq+mQGduhwFpAAGBgYAAAAA//8abbxQH9RTeefIydGL34YdADVaqqnoqW/Q28pHAfngGfRqBmqCSVS+6mEUDDwAlcUnqOgKg9EdamQABgYGAAAAAP//Gm28UBcoUXlbHWhLdP5g8NgooCqg9mV+rdADtUYBZaAD2oihFpCDjrCNguEFqHlxKgN0Vyo1T/Ed/oCBgQEAAAD//xptvFAXTIbeYUEtMHt0PnTYAVMqr614QOVDEEcy+EaDaYHq0XuPhh04QeWF8YLQC1RHAbGAgYEBAAAA//8aXbBLPQC6VG8PFc0DbY1WHu1RDztwCtqAoRYIYGBg2DjSA5XKAFQ5mVPRyNF7j4YfoPa9R3+hZz5R88bz4QsYGBgAAAAA//8aHXmhDgCNtsyispmjUwHDD8RTueGyd7ThQhOQQYN7j6jZGBoFAw9eU3nEkxl6XcUoIAYwMDAAAAAA//8aHXmhDgBdsd9LRfNGt0YPPwBa43KPiou5f0N7avdGesDSCMyi8snHJ6HbYkfB8AG02DrtzcDAsG00jRAADAwMAAAAAP//Gh15oRyAKqMGKpuZPdpwGXagksq70CaMNlxoCsqhU7fUAuaju0qGHfhJg+slJkJHYUYBPsDAwAAAAAD//xodeaEcULuHNnq41fADoAWbt6i4bRY0ZK0AXWA6CmgHCql8Cupr6JHwn0bjbFiB41QeVSuEdk5GAS7AwMAAAAAA//8abbxQBvSgB4NR65Chv9D7i24OlIdGAU3AeujCWmoB0JqMmaNRRXPACj0FmZrTAh3QUbhRMHwAaPr2ChVHTEY3axACDAwMAAAAAP//Gp02ogzMofLpiJNHGy7DDrhTueFyjQaLw0cBdvCbBmd6FFK5MTQKBh7cgJbd1AK80LNfRgEuwMDAAAAAAP//Gh15IR/EU3mv/xvoIXfUnGcfBQMLQD2xS1S+pM+BgYHh4Gi80hVQe1pgAwMDQ+AQ8PcoIB5Qe0E+w+hdZXgAAwMDAAAA//8aHXkhD4ASag+VzSwZbbgMO5BC5YbLjtGGy4CALCpbGgAdkRsFwwd8psEVHTNG0wcOwMDAAAAAAP//Gh15IQ/0QC9yoxYA9eyshlgYjAL8QBA6BShKpXAaPcRqYMFCBgaGOCq64DqVG7ajYHCAYwwMDJZUdEkilUf4hwdgYGAAAAAA//8aHXkhHVD7/iIG6Dkxo2B4gTYqNlwYoAt0RxsuAwcqqXx8gSYDA0P6UAuEUUAQUHv0hdr3oA0PwMDAAAAAAP//Gm28kA5mUPn+ohVUvqV0FAw80KLy9nnQkHTNaLwOKHhGg0WUzaMX8g07cAxaplMLiI7mfRpQe8QAACAASURBVCyAgYEBoNFpI9KAJ5VPPwT15NQZGBge0sPxo4BuYDsDA4MHFS0rofIJzqOAPMAJXZQpQcXwm0CDHU2jYGCBAnRakINKrgDtelMdrSeQAAMDAwAAAP//Gh15IR6Ado5MorKZ/aMJctgBdyo3XG7SIN2NAvLAdyqvdQOB3NG1L8MOPKDyIXOsVD4scegDBgYGAAAAAP//Gh15IR7kUrkSGT1tc/gBWmyNtoYORY+CwQOOQOOFWmD0VO3hB/igBxyKUdFnlqNLDKCAgYEBAAAA//8aHXkhDoB2jjRS2cza0YbLsAPU3hq9crThMihBCnT3F7WAx+jW6WEHQGV7HZU9NY3Kh6IOXcDAwAAAAAD//xodeSEOTIKOvFALnIa2oqlZAI6CgQWghXVXqbjD6Bt0nvvZaLwOSjCRyrsOr0GvGxktE4YPoMVIbBIDA8P8kR6wDAwMDAAAAAD//xodeSEMVGhwSFX2aCE17EATlbdGN482XAY1AO0AeU9FB2qN3jo97ACojC+gsqdAO964RnzIMjAwAAAAAP//Gm28EAbUvqJ8BXTkZRQMH6BB5a3R90Z3Fw16ANq+Xk5lRzZTuQE8CgYe7KbB1ukRf7EnAwMDAwAAAP//Gp02wg9cGRgYdlHRvM/QW6Mf08Kxo2DAwB4GBgZnKlruwsDAsHc0Ogc9AJWf5xgYGAyo6FDQOVKZwzS8RiqQg946Ta3D5kBHbIAOSx25I7MMDAwAAAAA//8aHXnBDZihC6SoCVpHGy7DDoRTueGybbThMmTAfxo0NEAjeObDOMxGIngELfupBdhH/NZpBgYGAAAAAP//Gh15wQ1yqHzN+Q1oD42aR4yPgoEF7NDtkLJUcsXo/UVDE6xmYGAIoaLLT1L5FutRMPCAHTpKR83FuyN36zQDAwMAAAD//xodecEOBKELMKkJCkYbLsMOVFCx4QICU0YbLkMSlEBPQaUWMIeO6I2C4QN+0uAOO2rPDAwdwMDAAAAAAP//Gm28YAcN0AYMtQDoEKqdg8yPo4AyIEvlhXOfaNBgHgX0AQ+pfKIqw+iFfMMS7ITWBdQChgwMDLEjMiQZGBgAAAAA//8anTbCBCrQKR5q7TD6Cz2/4Ro1HTkKBhysZ2BgCKCiI0oZGBh6RqN1yAJ+aCOGn4oe6BjdWTLsgBb07Bdq1S+gRbugxbsja1SfgYEBAAAA//8aHXnBBBOovDV68mjDZdgBdyo3XJ5Ct+SPgqELPlJ5USYD9MJGudE0MawAqC6YTUUPSUGnr0cWYGBgAAAAAP//Gh15QQXO0G2v1AKg+4uUoVukR8HwALQ4NTMCehXAKBj6AHRGjyIVfQE6IyRyNF0MK0Dt07hBoy6gNPd8xIQgAwMDAAAA//8aHXlBANDNnbOobGbtaMNl2AFq3190YLThMqxAMpU9A2rYWo3wMB1u4DW0bqAWAO1kGlkjtwwMDAAAAAD//xodeUGAMujRy9QCo3eVDD/AB90NRM1TUJWhvfVRMHwAtddDHaPyLdajYOABLUZw7RkYGA6NiLhlYGAAAAAA//8aHXmBABEGBoZ6KptZNNpwGXagksoNl57RhsuwBIVUzvtWo1unhx34S4Ot09NHzK3TDAwMAAAAAP//Gm28QEAvlS+7Gt0aPfyAPLRSohZ4M7o1etiCBzQ4gwO084hjpAfsMAPU3joNGsUZGVdLMDAwAAAAAP//Gp02YmAwZWBgOEVF80a3Rg9PsBy6/oBaII/KJziPgsEFhKDHwnNT0VUVVJ7aHgUDD6i9dRp00zloKpqaN54PPsDAwAAAAAD//xrpIy+gxtscKps5e7ThMuyABZUbLpdGGy7DHryDrqOjJqhiYGAQG+kBO8wAtbdOgw5XBd1OPrwBAwMDAAAA//8a6SMviQwMDPOoaN5r6K3Rr6lo5igYeHCcynfNvIHeMjsKhj9woLIPR2+dHn5AFLoRgI+KPtMd1mUMAwMDAAAA//8ayY0XLujcNDUXYGYwMDDMpKJ5o2DgQTj0rI1RMAoGC7CAXt44CoYPKIeua6IWOEiDhvPgAQwMDAAAAAD//xrJjZcOaIKhFhjdGj38AC/0MClqXr44CkYBpeAkdOv0aFkzfAAtbp32Z2Bg2DQsQ4uBgQEAAAD//xqpa17kaLBNbXRr9PADVaMNl1EwCIE59LDEUTB8AC1unQbtogUdvjr8AAMDAwAAAP//GqmNl4lUjtTRrdHDD2hQeWv0KBgF1ATNo7dODztA7a3ToEuGQbsahx9gYGAAAAAA//8aidNGdtD5QGoBUIvZAHoT9SgYPmA7AwODx2h8joJBDCaMNrCHHdCCTh+xU8ljnxgYGBSG3dZpBgYGAAAAAP//GmkjL4zQUwipCfpHGy7DDviPNlxGwRAAuVReIzEKBh5cg9Yp1AKgHUztwy5eGRgYAAAAAP//GmkjLxlUbrw8hm6NHr18cfgAUI/n9uhal1EwRMBuBgYGt9HIGlYANB14l4o7YUEVuc6wOn+MgYEBAAAA//8aSSMvvDRogZaONlyGHagYbbiMgiEEXEfvPRp24DO0bqEWoMWMw8ACBgYGAAAAAP//GkkjL6D54XwqmneagYHBjIrmjYKBB6LQHs/oQshRMJTAQwYGBnXo+rtRMHzACejOMmqBEAYGhrXDInQYGBgAAAAA//8aKSMvSgwMDDlUNjOXyuaNgoEHTaMNl1EwBAHo0tCC0YgbdoDacdpHxYXAAwsYGBgAAAAA//8aKY2XWVS8+AoEFoyecDnsAGjhY+pID4RRMGRBFZVPCx8FAw9OUPl0b9D5ZiXDIl4ZGBgAAAAA//8aCdNGfgwMDBupaN5n6K2do/cXDS8wujV6FAx1MHrv0fAD8tCLXKl179E36Pkvz4d0SDEwMAAAAAD//xruIy+gg+imUNnM1tGGy7ADo1ujR8FwAKmjW6eHHQCtZ2qjoqdAd/p1DflAYmBgAAAAAP//Gu4jLxVU3mH0iIGBQW10YdywAqA54FvQIdVRMAqGOgCd0Oo5GovDCoDKqJvQURhqgaF9uScDAwMAAAD//xrOIy8SDAwMNVQ2s2y04TLsQMFow2UUDCMAGkF0H43QYQV+UvkSYRCYPKQDiIGBAQAAAP//Gs4jLwsZGBjiqGjeYejVAqNg+ABhBgaGOwwMDAKjcToKhhG4Cb2baxQML3CQynVQArSeHHqAgYEBAAAA//8aro0XUwYGhlNUNO8v9Ar60R1GwwtMh566TC1wDzq1OApGAalAicojgKAp887RWBhWADTVc5yKHgKt3QTdewRaxDu0AAMDAwAAAP//Gq6Nl4sMDAx6VDRvdBX/8AOm0IKAmlvoQUdwXx3pATsKyAKG0Av5qAU+Q9PjaGN6eAFqd7hADVxQQ3doAQYGBgAAAAD//xqOjZd46Dks1AKfob2iNwPrrVFAZXAK2oChFmhgYGBoHI2kUUABWM/AwBBAxQAEnRESORohwwqIQqe6qbV1+jd06/TQauQyMDAAAAAA//8abgt2QdvAeqhsZutow2XYgXgqN1weQ0+vHAWjgBJQQOUNARFUPl5+FAw8eE3lrdOg40QmDbl4ZWBgAAAAAP//Gm6NlzoGBgYRKpp3A3on0igYPoCXBg3c0Qs6RwE1AOhMj34qh+REKk+NjoKBB6A6iZo3RIPOuRpam1EYGBgAAAAA//8aTtNGstBL9VipaCZo2+FOKpo3CgYe9FP5zhBQIaI9Gq+jgEqAF7puipo3m4PWSMwcjaBhBUDb4UFn+lALgMox0DpR0OaUwQ8YGBgAAAAA//8aTiMvU6jccNkx2nAZdkCDBhdqFo30QB0FVAWfaZBGm0fvPRp2AFQ3UbPxAjqZmZoLgWkLGBgYAAAAAP//Gi4jL3bQPfDUBOrQk1dHwfABuxkYGFyo6JsNDAwMgaPpYxTQABxlYGCwoqKxozsmhx8AnfYOOtOHWuA99N4+ED24AQMDAwAAAP//Gg4jL8zQ7WPUBBNGGy7DDrhTueECWliZP9IDdRTQDJRS2eDRe4+GHwDVUaBGKbWAIHTX5OAHDAwMAAAAAP//Gg4jL9lUvnzxDXRr9OgCzOEDmKE3s1Kz8O5gYGCoHOkBOwpoCpZDdwxRC4zeezT8AGg6ELRGilrTgqA1L6DpddB27MELGBgYAAAAAP//GuojL7zQ+VxqgprRhsuwAylUbri8ofJ2xVEwCrCBXCqXRaP3Hg0/ANo6XUtFX4E6elMHfSgxMDAAAAAA//8a6o2XFuhQF7UAaGv0nIH10iigMqBFA7dktIE7CugA3lC5YmKAnkc0unV6eAFQnUXNrdNug36EjoGBAQAAAP//GsqNFxXolBE1Qc5Q2io2CogCVVTeaXF6KF9mNgqGHJgCTXPUAlrQkchRMHwAqM6i9q5H0MF1g7eRy8DAAAAAAP//GsqNl2lUDlzQUdp7qWjeKBh4ALrorpDKrqD2NtZRMArwAVDFlEflEGqm4vHyo2BwANDWadDuR2oBWgwOUA8wMDAAAAAA//8aqo0XLwYGBlcqmgfaOVJGRfNGweAAoEvH2KnokhWjN4uPggEAJ6Bpj1pAdHSx+bAE1L5eAnRXm/CgDCgGBgYAAAAA//8aio0X0EF0k6lsZj/0fppRMHyAOZV3aoAKhfLR9DEKBghUULliAo1Iyo9G5rAC1L5eQgC6rnTwAQYGBgAAAAD//xqKjZci6FZmagFqX3Q1CgYeMNOggds+FG9eHQXDBlC7YmIfvbdtWAJQOQWq06gF0gfl+UAMDAwAAAAA//8aaue8iEAzMRcVzUwYXYA57EA6lQ9vAo3KqVK55zsKRgGpgBd6fxs1F6CP3t82/AC1y79DDAwM9oMqlBgYGAAAAAD//xpqIy99VG64nBxtuAw7wEuDoc7c0YbLKBgE4DMNTt4d3To9/AC1t06Drt8JH1ShxMDAAAAAAP//GkqNF1MGBoZYKps5erz78ANN0BE6agHQCv6NIz1QR8GgAQupvGhcC3pExCgYPgC0Q43auyxBU5bU3PxAGWBgYAAAAAD//xoq00Ygd16AXtlNLQBavR85sN4aBVQGoGOtr1CxJ/kTOl00uph7FAwmYA7dgUQt8Bl6IR8110qMgoEH1L5eArTFvm5Q+IyBgQEAAAD//xoqIy/JVG64jO4cGZ5gCpWHwNtHGy6jYBAC0MjLAio6ixc6YjkKhheg9g410JSl7KAIIQYGBgAAAAD//xoKjRdeGuwGGt05MvwAaE7WmYq+egy9fHEUjILBCEDnUn2iortSoSM6o2D4AGrvUONgYGDoGRShw8DAAAAAAP//GgqNlxoqr64frZSGHwDNxXZT2Velo4t0R8EgBtQ+4gE0YjlxNMKHHQClEWp21MMYGBgsBjyQGBgYAAAAAP//GuxrXuSgV3OzUtFM0BzgSiqaNwoGHtQzMDA0UNEVoGsiXEbjFS/Ihh4xD9pCyQ9dGwSbsuNkYGBgg65VQwf/oAsKfzMwMHxnYGB4x8DA8JSBgeE+9Gr/fQwMDOcHn3cHJQA12m9S+bC50aMjhh8AjUpT84RmUP40GtBQYmBgAAAAAP//GuyNl7UMDAxBVDRvtFIafkAOukiXl0o+A1WsOtAbxkcBBBhCL7g0gM5503rXAajg+QBt0OyEDlW/G40LrIDaFdNr6L021JySGgUDD0ALvKk5LRjPwMCwaMB8xcDAAAAAAP//GsyNF9De8oNUNG+0UhqegNor6kGHO2WO8DCVhVaKIdCF8pyDwE2vGBgYtkN3PNwdBO4ZTIDaFVPH6N1Hww6A0sdRKm5oeAYdbf02IAHFwMAAAAAA//8arI0XRmhvmprHEo9WSsMPjG4ZpS6ogU4HSQxydz6B7rapHQRuGQyA2hUTaK2XOnTB5ygYPmA6AwNDBhV9A9qhBpqypz9gYGAAAAAA//8arI2XFAYGhtlUNO8NAwODJpQeBcMHULvHWQG9iXokAQHoHTehVD69mh7gH3RaKWZ0WonqFdPoOVjDD4A2voBGLak1xQ5q5ILuGQSNwtAXMDAwAAAAAP//GoyNF1ABeo+BgUGcimaCMvVMKpo3CgYeUHuuH7QiX20E7TACrWPpZWBgcMCxsHYoAVAjZh20ATZSAbUrJhCwpPLI5igYeEDte4+W0ODke8KAgYEBAAAA//8ajFul66jccLkGvethFAwfAFow2kVl35SNkIYLaGfKOQYGhrMMDAyOw6DhAgJM0PU5f0bwTcmgqc5WKpvZP3rv0bAD1L73CDTqCeoI0RcwMDAAAAAA//8abI0X0M6RIiqbWQRdrDsKhg+ogKYVaoGTI2T7fBf06AHDYdJoQQfM0PvK3jIwMLgNLqfRBYB2ZT2gokUW0Cn8UTB8AKgupHYdO43uocPAwAAAAAD//xps00ZrGBgYgqlo3g4GBgZPKpo3CgYegBott6i8XdeCypfdDTagDD1DZVBdrEYHAFrEajPsfYkKRrdOjwJiAGjnngcVQyqagYFhGd1CnoGBAQAAAP//GkwjL3ZUbriAWpjFVDRvFAwO0EnlSnjBMG+4TIGOtoy0hgsIWDMwMPyg8llRgx2ARhCPUdGNoqPbpoclANWN1JyRAJ1wTr8yhoGBAQAAAP//GiwjL6Nbo0cBMWB0azTxgAfaKKNmnhrKYDcDA4MPAwPDrxHgVyvoqBO1wOjW6eEJqL1DDbReFXQOE+0BAwMDAAAA//8aLI2XZCovqgVVRtqjV7wPOzC6NZo4YMrAwHBgCG59pjUAlQcaI2RbNbUPb9zAwMAQSEXzRsHAA9CoGmhUFnTNBzUA6MA6BbrUuwwMDAAAAAD//xoM00a8NFgl3zracBl2IJ7KDZdHw3RnSjZ0xGW04YIJRKGjB9KDzWE0AOXQkUVqgQAGBgb34RRAowBcR4JGS6gFQGUOfW6dZmBgAAAAAP//GgwjLz1UXptyBroAc3SH0fABvNAzLKh5u/hwvKBz3WjvmCjwA3rtwe0h4FZKQDmVb9C/Bg230bJ1+ADQDj3Qkg3QiCS1AO03QDAwMAAAAAD//xroxosS9K4hat4abQptwIyC4QPaoVM81AInB8u17lQEF6EVyyggDvyGjuQN5xus2aE786h5rMDogZ/DDzgzMDDsoaKvLtD87BcGBgYAAAAA//8a6GmjWVRuuCwYbbgMOwAqeAup7Kn8YRZIZ0cbLiQDULlzephvpf4JPXyRmqCZimskRsHgAHupvL0edPt8Ek19xsDAAAAAAP//GsiRF3/oIjBqgc/QkZzR+4uGF1gPnW+nFhhud7aAKmCTQeCOoQp+Qxf3D+cppF0MDAyuVDRvAg06FKNgYAHoJnnQWVDUul4CtJ4GtJOTmuuuEICBgQEAAAD//xqokRfQcOZkKptZO9pwGXbAncoNl8/QdQDDBewZbbhQDFihU26SQ9wf+EABldep5I5uwR924DGVN86A1ic20iyQGBgYAAAAAP//GqjGSym0pUctcBN6GNcoGD6AmQa7gVqhu4yGA1gGnaseBZQDTujaO55hGpbXqHxLPzP0Us9RMLwAqLwF5QNqgTzo6czUBwwMDAAAAAD//xqIaSNp6BAtJxXN9IBejT8Khg+g9u2noJ6F6jC5fLFsmJ5PM9DgBbRT9WcY+k0UOi1AzR17oFHRjVQ0bxQMPACNdoOu1aEWAI0OU3PKEgIYGBgAAAAA//8aiJGXHio3XHaMNlyGHRBhYGBoobKncodJw8WCyttfRwECSEBP4h2O4DV0ap2aYNIIvXZiOANQXUrNxosLAwODL9XDi4GBAQAAAP//ovfIC2gb8ykqmvcXusuCmld8j4KBB9Q+tno4XdD5jcqN/1GACeIYGBgWD8NwAU33XKLyepXhekr1SAag9AFKJ6D0Qg0AOsUXZCZocTx1AAMDAwAAAP//oufICyOVrwBggM7jjjZchhcAHZaUSkUf/RxGOyPOjDZc6ALmMjAwCAxDf4E6e0VUNrOaylNRo2DgAbXXSIHWvVD3eAoGBgYAAAAA//+iZ+MlmcpnUXym8tHGo2BwgH4qtvgZoOZRcxHaQAHQtJfxMPDHUACs0LuhhiOg9rQAaGtt1zANq5EMQHXrJyr6HzRlSb1GLgMDAwAAAP//olfjhRd6Sio1wej9RcMP+EMXX1MLgLbOtw2DUBKBNsJGAf2APpWvLRlMIJ3K678SqHzv2CgYeACqW6lZdoIONqReG4CBgQEAAAD//6LXmhdq3190A3qK33BYgDkKIIAduguNmlvoQYXqwmEQvseH4XUGQwH8hl42Nxx3H41euTEKCAFQmXyOymukQNcGgK4PoAwwMDAAAAAA//+ix8iLEnS/NzVBwWjDZdiBAio3XE4Pk4aLxWilMGAANH00dZj6rY3KZx6BRl7CqWjeKBh4AKpjqb1GijrHXzAwMAAAAAD//6LHyMseKh+mNZx2jowCCKD20dQgYAZtwAx18IjKjbpRQBoAjb6wDdMwC6fynTagtKpDyyPhR8GAgO1Uns6Phh6yST5gYGAAAAAA//+i9ciLH5UbLsNp58goQIAuKjdcFgyThovNaMNlwAFo9GXeMPXbSiqfawO6RLWKiuaNgsEBQEs+qHm9BGgZCWg6lnzAwMAAAAAA//+i5cgLKNPfpXLhCzqcq5KK5o2CgQfUPvtnOF3QeR26dXwUDCz4A21c/xiG8UDtMz1AHUy1YXQNxyiAANCGAdDUPrUAaMNNDdmGMTAwAAAAAP//ouXIC7XvLxouO0dGASqg9pqC1mHScNEabbgMGsDCwMAwbZj6jdpneoAWeU6konmjYHAA0NZpau7uLYGO1JEHGBgYAAAAAP//otXIC+iY7XtUPlALdOLqTCqaNwoGHsRDp3ioBR5Be33DYTH3Dug9I6NgcICvw/jiRlHoKah8VDRz9L654Qeofd/cOgYGhmCydDIwMAAAAAD//6LVyEsnlRsuJ2lwOu8oGFjAC537pCYoG0a70EZvjB5cgJuBgSFomPqN2md6gEAflQ+bHAUDD0B1MDVPtAflJyuydDIwMAAAAAD//6JF48UQejcINUE+lRcMjYKBB1XQw9eoBU5CFyAOB1AAnaoYBYMLNAzj+JhA5YoJNO2ZQkXzRsHAA1AdTO0NM5PJ0sXAwAAAAAD//6LFtBG1D9QCbeWLpKJ5o2DggQb0oCJq3khrAW3ADAdwhYGBQXs0nQ468B965xE1j00fTMCdylcHvIam49GT0IcXWM7AwBBBRR+Blg8sIkkHAwMDAAAA//+i9shLIJUbLqApgHIqmjcKBgdop3LDZcUwargwjC7UHbSAcZjfoEzte49Aa2maqGjeKBgcAHQyMzWn50FTlhwk6WBgYAAAAAD//6LmyAsr9Hh3eVIdgQeMbo0efoDavbvhtjXTl4GBYdMgcAcl4DsDA8MTBgaGlwwMDI+hcQQqF8QYGBikh/iNzc8ZGBikBoE7aAWovXX6L/RC3tHb/4cXoPb1EqDdTM1Eq2ZgYAAAAAD//6Jm46UQukiLWgA01Kg8elrjsALM0CkRao4sgNYhNA6jQFrNwMAQMgjcQSr4Cs3/xN70Phc6HUzNhf30AKBCkZ638Q8EoPaZHqCD8NyGjvdHAREAtDMNtEONWjdFf4PW9y+IUs3AwAAAAAD//6JWJhShQQVSO9pwGXYgh8oNl8fQ0bnhBIba7bz/oAvqeUhouIBAMvSUzdYhthgf1OGLGgTuoCWg9pkerqP3Hg07AFr3BaqjqQVAZQHxU7IMDAwAAAAA//+i1sjLHGhhRC0AWr9gPbrDaFgBEejZP9S8BiCAgYFh4zALpz9DaIvpGyr2vEA9LnEqmUVrsBl69clwBtQ+02M4ncE0CiAAVE6Bphipees0cRsvGBgYAAAAAP//osbIC2g+M4kK5iCD0a3Rww80U7nhsmMYNlzshlDD5RMVGy4M0IMt71DRPFqCoTY6Rg6g9pkeclSeihoFAw9AdfTA3DrNwMAAAAAA//+iRuNlDnQolVpguO0cGQWQ+4tSqRgOw/WCTp9B4AZiAGh0iJ8G5qoOkYXXoiPgHJ6/NOiUVlN6JPwoGHQAtENtAxUdZQDdOo0fMDAwAAAAAP//orTxEgutmKgFRrdGD08wlcojCqAFhTeGYUgZDAI3EAM8aWi26hAYdWUcIVc3nIR2JqkFeIf5VvORCkAjatScDgStY8R/6zQDAwMAAAD//6Kk8ULyAhsiQP/obaTDDoRTuYFLi6PMBwtQHgJuPMfAwLCHhub/GiKLOy0HgRvoAcqpXDFFjJBpt5EEHkLrbmoB0BQyaJQON2BgYAAAAAD//6Kk8QJK1JJUdPBwrpRGKgAdRNdNZb8P511og33BKmgFvxkd7FnLwMBwnw72UAL0Brn7qAUeQc/0oCaYOHrv0bADoDRCzR1qxXjPU2JgYAAAAAD//yK38SJJg+md0a3Rww+AhhNlqeira8P8gs7BfubJSTpO6Qz2K0GGwigZtUAHlUfEzUfvPRp2gNpbp0Ed316csgwMDAAAAAD//yJ3q/QSBgaGaEpchgZGt0YPPwBqtFyl8g6j4XzNPgf0ZNrBDNSgp2jTC7wfxKfxgtwmNAjcQS8QTuX1L6OHkA4/QIut06Dp2RMYogwMDAAAAAD//yJn5MWUyg0XBujhZaMNl+EFumiwNXq4NlwYhsBi3Z90brgwQDtJgxXwDWK30QKsxFWJkAlEoTfLj4LhA0B1eAKVfTMNqygDAwMAAAD//yKn8ULtYfsFDAwMZ6hs5igYWGBK5VtHf0LnQIcz0Bzkfrs+AHZScxia2mAkrtkopHIns5DKvfRRMPDgNLROpxYwhO5qRgUMDAwAAAAA//8itfGSQOWFaqAhw1IqmjcKBh4wQ7dGUxP0j4CL3ah54BstwPYBsPMDdJHwYAUjad0LA3TkZTYVzSO4rmEUDEkAqtOpOR2IuXWagYEBAAAA//8ipfHCQ4N7ZJqgR4yPguED4qm8UyJaeQAAIABJREFUNfrNCNmFRvBcgwEGEwfI+l+DJgQwgfRgcxAdQB10cSa1AGgdm9dwDrARCEBlNqhupxYA7TpCvcGagYEBIFIaL7VU3sp5g8p7w0fBwANaHEJVMkIW9Q32xsvLAbJ3MK+Fo+ZREUMF0OJIi+7RrdPDDlB7tLwM5XRmBgYGAAAAAP//IrbxokSD49gLRhfpDjtQBb2AkVoANH+6cISEHdsgcMNgBIO5jBgqF0lSG0yAHkxGLaAF3bQxCoYPoPa9R6hTjAwMDAAAAAD//yK28TKJgYGBlYoO2TDMd46MRCBH5QYuKPFnj6BwHOzbpAcKULPcoTaQGDKhSF1Ai2tcmobAuq9RQBoA1fGgXaLUAiEMDAy2YMMYGBgAAAAA//8ipvHiysDA4E1FB4ASft5oIhh2YCK0dUwtMBs68jJSwNuRnoBwgMF8AaLwIHDDQAHQ1uldVLSbj8rrJEbB4ACgXaLUHD0F3TrNyMDAwAAAAAD//yLUeGHGt8+aTAA6Rvgxlc0cBQMLQJfUBVDRBZ8H+TZZWoAPg9x9A3X673C/vXkoA2pvnU4d3To97ABo3Qs1r4gBpY8kBgYGBgAAAAD//yLUeAFteVKhosWPabBjaRQMLAA1cPuo7ILaEbgLjZr3gtACRA2AncYDYCcpYKSfDnuNylunmUe3Tg9LAFrgTc3rJToZGBgEAAAAAP//ItR4IXizI4mglMo3lI6CgQcpVO4tgXahTRmB8TrYGy9uA2Bn5QDYSQr4OMjdRw9Ai63T/oPXu6OADABq5IPSCbWAMAMDwxIAAAAA//8i1HihZu/3CnSedBQMHwBaYNdMZd+M1F1oNwaBG/CBgWi82A+AnaSAwT7VRw9Ai63T1F4/NwoGHoCu+rhMNWcwMKgDAAAA//8i1HihpmUlVDRrFAwOQO0dAsP9/iJ84B0DA8O/wes88AWJ9Nz5w0Tlbfe0ANQccRjKgNpbp+WhnZhRMHwAqENKvdP0GRguAAAAAP//ItR4uUoli7aMbo0edgB0w3AGFT31kwZnCQ01MNjXUGyio13UvMGYVmD0dHAIoMXW6aoRfI7OcAWgNgCoLUA5YGC4DAAAAP//olfjZfTixeEHqH1/0fQhMHVCa/BqkLvPnU4nobJAz3QY7GC437dFCqD2rdN8o5s7hiW4QBVPMTBcBgAAAP//ote00WC/MXcUkAZAd5G4UDHMXlN5QddQBfcHubtB5yscoYM9t2BnOQxyMNjji96A2lunQRcBWw8Nr48CIgHolmjKAQPDJQAAAAD//yLUeLlOpXl4/dGYHTaAncr79hmgW6NH+rZTBiqvMaMVsGBgYAiiofmtDAwMigPrRaLA6K5JTEDtW6dBoIfK5o2CgQXUuIn9GwMDw10AAAAA//8i1Hj5RaWhfI0hcPHcKCAOZFN5azRo6H3OaNiDweZB4AZiwBoadUgyoGsdhgIYbWxjB9TeOm0xQGcMjQLqAyFoW4BScJGBgYEBAAAA//8i5nqAS1Tyg+5oYhjyALSzqIHKnigavaATDg4O8h1HMACa0jnLwMCgQ0Uzp0LXPQ0VMNjP5RkoQIut022jW6eHBVClkicuMjAwMAAAAAD//yKm8UKtRbsGVDJnFAwcAG2N5qWi7SN5azQu8GBwOgsDMEOnuahxBAJoB0IWld1HazB6xQluMIHKi5lBW6crqO3IUUB3QK02wBUGBgYGAAAAAP//omfjZXTkZWgDXSpvjf4LvbRrFKCCg0MsPLqhZ3yok6E3GTp/Tc2LX+kFqLmzZriBn9ARVWoC0Iiv5EgP2CEOqNUGuMLAwMAAAAAA//+iZ+NFjUrmjIKBAdRepDt7dKspVrBwELqJEJCDro17DL14lRCogq4ZmTOAFz5SCrYNUXfTC+yEjqxSE4zeezS0AbXaABcZGBgYAAAAAP//wrsd8f///3AmFSx8MdpyHrLAncoF0WfoqvPRdQPYwe9hcJsyyA8/oHH9CzrNJARduD8UtkHjA/+hJwCPAvwAtLD/HJXXq1iOjnoNWfCcgYFBgkIznjEwMEgzMDAwAAAAAP//IjYDnqPQQgaoo0dPTBx6gJ0Gt0a3jjZc8IJjg9htxAJW6PooKQYGBgUGBgZZBgYG7mHQcGEYvdOIaAAaWe2nspnUNm8U0AeA6n5KGy4gAJ4yYmBgYAAAAAD//yK28UKt8ye0qWTOKKAfyKfy1uhH0AV9owA3qB0Nm0ENhsqi6sEA2qjcUQFtnQ4busExYoExlTwOnjJiYGBgAAAAAP//IrbxMrpdemQC0NboGir7PG/0gC+C4BADA8P7Qe7GkQyOjvQAIAF8pvKFfCDQNbp1esgBatX9kLYIAwMDAAAA//+i98gLNQ6oGQX0A7TYGr1xNP6IAquHgBtHKhhK59EMBgBahH6Siu4YvXV66AFqbZOGNF4YGBgAAAAA//8idsGuOHTBLaXgBHTB1SgY/EALmlCodRHfT+iprDdH454oIAS9tXg4rBEZTuDHEN4hNZDAnMoLbUGn+KqMrp0bMgB01RA1Bi8g5SEDAwMAAAD//yJ25OUlAwPDWypYPHpQ3dABPVS+Qbh/tOFCEnjHwMBwfgi5d6SAkX7zObkANPKygIrmgW6d7qSvF0YBBYAaDRfEsS0MDAwAAAAA//8iZbsfNc574Rg972VIANCt0Z5UdOhjGhwZPhJA2kgPgEEINo30AKAAlFH5TqjE0Ut/hwTQo5Ir4TuNGBgYGAAAAAD//6J344WBildijwLaAGYaHAaVO3qRHVkAdH/Q3SHo7uEMpo30AKAAvIYek0BNMHMoBsQIA5pU8i6i8cLAwAAAAAD//xqIxsvo1NHgBjlUXlh9cnSRLkUgfQi7fbiBt9Ap9FFAPqD2vUegtTTho/ExqAFV7zQCAwYGBgAAAAD//xqIxsvojqPBC0QYGBiaqei6v9BzYkYB+WAv9O6gUTDwYPRKAMoBLe496qLyrshRQF1A/cYLAwMDAAAA//8ipfFykQg1xIDRxsvgBc1ULgRmU3mL5EgFQ+3G5eEKGkd6AFAJUPveIznofVmjYHACatT53xkYGO7AeQwMDAAAAAD//yJ2qzQMPKPC/UT/oCvFv1JoziigLjBlYGA4TsUdRqP3F1EXXKTiwrdRQDp4D92+PgqoA2hxFIMa9ATvUTB4AOguM1BdQOldYKegU4QQwMDAAAAAAP//ItVAapy0C7JThwrmjALqgqlU3ho9en8RdYEHtOE/CgYG7BoNd6qCa9CRWWoB9tGt04MSgE7WpcYlpqhtDwYGBgAAAAD//xqIxgvD6KLdQQfCoSMv1AKPR+8vojoA3cg6b5j5aSiBhpEeADQAddDD5qgFIhgYGFyHUwANA0Ctuh512QoDAwMAAAD//xptvIwC0BqXbiqHQuno/UU0AakMDAwfh6G/Bjt4Mno4HU3Aa2gDhppgApVHkEcBZYA2jRcGBgYAAAAA//8aqMaLKpXMGQWUg3IGBgZZKoYjaHfMytF4oRnwGab+GsxgdBSRdmAKlbdOg9bSJA82T45goE4lr4POvEIABgYGAAAAAP//InXBLliYCg55QYWFv6OAcgBqtNym4g2tf6HrmUZ7qbQFixgYGGKHswcHEfjNwMDANtIDgcbAncq7j15D7z2i5pTUKCAPgKa7JSgMuwcMDAyKKCIMDAwAAAAA//8iZyENNc57kYBe9jgKBhZMovLV8pNHGy50AXFUPLpgFOAH1KxURwF2ANo6vYGKYSPKwMBQORrWAw5AdTylDRcQQDnfBQwYGBgAAAAA//8ip/GC1SAywOi6l4EFoN5OABVd8Hn0/iK6AgPordOjgLagcDR86QLyqbxOrhA6hTQKBg5Qq46/jCHCwMAAAAAA//8ip/GC1SAywOhhdQMH2Gkwj187ujWa7kB19LwkmoKro3dL0Q08gt48Ty3AToM72kYBaYB2jRcGBgYAAAAA//8ayJGX0cbLwIECKof/NejCu1FAX/ABeqvur9FwpwnIHYZ+GsyggcpXYXhAR5hHwcAA2jVeGBgYAAAAAP//GsiRl9Fpo4EBoEW61VS2uQi6WHcU0B/chS6S/j4a9lQFTxkYGPYPI/8MBfATuvuRmqBvdOv0gAEFKtgMOpgTczcaAwMDAAAA//8ip/Fyj0o9PWqdvDcKSAPUvsRsB3TB3SgYOHAbuhr/w2gcUA1Qu4E/CogDoGMWTlAxrEDrXlJGw57uAFS3U+M6E9DULebJ4gwMDAAAAAD//yK38XCBMveAAffoeS90B+bQUyipBUCjLcUjJ/gGNXjJwMAgCO1cjALKAKgRuHA0DAcMUHuRdDt0B9IooB8ALUsA3WtEKcB+thwDAwMAAAD//yK38TJ60u7QBBOp7OrZVD5gahRQDkCXYR4eDUeKQPsQdvtwAKCRlxVU9AeoUd80coNzQABoZoUaAHtbg4GBAQAAAP//GujGy+iiXfqBcPRbOSkEtDjaexRQB9gxMDBUjV7kSBb4Ap1aHQUDCyqovHU6dXTrNF0BtQYmsLc1GBgYAAAAAP//IrfxMrpdemgBdhoUyKNbowc3AI0eaEK3oI4C4kHzaFgNCvCQylunmUeveaAroG3jhYGBAQAAAP//Iud6ABAQYmBgeEupq6CnsWpSwZxRgB+AVvB3UDGMbkB3uIzuMBoaIANacFPzNOXhCL5QeTH7KKAM8ELXcIlQMRwjRu9eowu4T4XdRqC1Z6ApP0zAwMAAAAAA//8id+TlHXQrIaVADbpwdxTQDojSYOdEwWjDZUiBGdDFcz2jh9rhBaOjLoMLgE7tLqGyi7pGG/E0B6CyRo4KtpzDKcPAwAAAAAD//6JkqzI11r0wQXvwo4B2oInKvckNo1ujhyQArX8pZWBg4GFgYMiEbkGkxiWrwwV8GF3rMijBQuhN9dQCctD1NKOAdoBax6DgbmMwMDAAAAAA//+ixILRdS+DH2hBF6pRC/yE3kEyCoY2mAHtNDBBTzW9PdqQYUgYBG4YBdgBtbdOV1JpZGAUYAc0X+/CwMDAAAAAAP//GgyNF20qmTMKMMEUKp8u2T+6AHTYgUbo9C0TdG3UUQYGho8jLAxAheTGQeCOUYAdXKby1ml2Kq8BHAWogFp1Ou7GCwMDAwAAAP//InfBLgP09DxqXMsPOqHVkwrmjAJU4E/la+ZfQ88Q+TwaziMGuDEwMNhC70+SZGBg4IdOQXIQEQAs0CmqwQ7+Qw/LHL2AcXADReiZUsSkPWKBJZVP8x0FEAC6VsOBwrAATXOD4vo3VlkGBgYAAAAA//+ipPHCBr1PhdK5rRfQgnEUUBfcgTY2qAViGRgYlozG0SggEpxiYGAwHQKBtZLKp06PAtqBHAYGhslUNP0sAwODyWh8UR2AOrqU7hDDvxOZgYEBAAAA//+ipOEBut/oOgX6YUCCgYFBnArmjAIEKKdyw+XAaMNlFJAAYoZIwwVUhsUNAneMAuLADOj6LGoBYwYGhvTRsKcqANXl1Njajn9DEAMDAwAAAP//onTUZPSk3cEHaLE1OnM4BMwooAuQZ2BgmD9EgrqUSpfMjgL6gD/QNVnUBKDt8Xyj8Uc1QJfFugwMDAwAAAAA//+itPEyuuNo8AFqb42eDh3CGwWjgBhwFrreZbAD0BqXSaMxOqSACg12hYlCdx+NAuoA+jReGBgYAAAAAP//GiwjL6MXNFIHmFN5a/TH0QvNRgEJALT4XngIBNj/0U0CQxLQ6hDBQuiI4SigHFBrIAJ/24KBgQEAAAD//6K08XKVQv0wMNp4oQ6YSOWt0QehC6pHwSggBECNZvchEkqLqbx2YhTQHtjRcGH16NZp6gFqNF6+Qe+2wg0YGBgAAAAA//+iZLcRDHyhwhH/PxgYGDgpNGOkgzAa3NnxB7pn/9ZID9xRgBeYQrecUuNUTVqDT9At36Ng6ABmaEdZncYuBh0NsHs0XVAEQDuQKd3ODipLQNvYcQMGBgYAAAAA//+iRmFzhQpmgDyrRAVzRjKgRc8BtHahb6QH7CjAC0CXtB4aIg0XEAgfBG4YBaSBQjo0XECgdzReKAKgE92pcQ4P4bW0DAwMAAAAAP//GiyNFwbofQijgDxQDj3EiRbAm4GBIXo0XkYBDkDtg8NoCY5B1+WMgqEDhGmwexIX0B3dOk0RoFYdTrhNwcDAAAAAAP//GkyNl9EdR+QBWTpk7n4q72AaBcMDnBhCZzT9GkJrckYBArQwMDAI0DE8mkfLOrIBtepwwiMvDAwMAAAAAP//GkyNl9FFu+SBLjpkNtB2wloa2zEKhhaYAt3dNlRANHR93igYOgDUk8+gs2tFR3dYkg2o1Xg5T1AFAwMDAAAA//+ixoJd0Am5z4l1FR5A8DjgUYABTKHHsNMD/IDGz4PRaBjxoAA6GjdUwB4GBgbXkR5pQxBQ444ccsBf6N1910ZagFMIQCfuU9qAeQltU+AHDAwMAAAAAP//osbIC2gr7XsqmKM2hBb9DQYAWoE/lY7uAK1raB+8wTEK6AQ8htgi7m+jZ7oMSRA/QA0XBmjZOrp4lzTABa3DKQXEHXzLwMAAAAAA//+iVmOBGofVMUFvdx0FxIGUAbg/JmJ0em9EAx0GBoYtDAwMeEdsBxnwgW75HwVDBwgOgsaDx+gaKZIAaIqPfstQGBgYAAAAAP//olbjhVrXBBhTyZzhDkBrXBoHyI+zRk4wjwIkIAadoqTmIYi0BmugUw+jYGiBskFyUvP0QeCGoQKoNfBAXFuCgYEBAAAA//+iVuNldLs0fUHTAO7yMIUO6Y6CkQPYoGvShtJBkm8YGBhCB4E7RgFpQAt6rstgAIrQYyhGAWEAOsyUGoC4tgQDAwMAAAD//xpsjZfRKQnCALQgKneA3dAzup1wRIGb0KH8oQJA00QmIz3ShijohR7XP1gA6BgKuZEeKUQAatXdRO00YmBgYAAAAAD//6JW4+UClcwZbbwQBv2DYOheBLpFexQMfwDaQaAwxHyZQszdKKNg0AF36FqTwQRAnbTO0aRCEFCj7r7HwMDwmyiVDAwMAAAAAP//olbj5SsDA8MTKpgjMYQOvRoI4D+IMncqdIh3FAxfcHEIHh65iYGBYeEgcMcoIA2AOmQTBmmYRYxutccLQHU2UdubCQDi184yMDAAAAAA//+i5tbk0ZN2aQtAQ6mTB5F7BnNhMwooB6egZ10MJfAG2sAfBUMP5Azysn/CEFusTk9ArRkT4hsvDAwMAAAAAP//ombjhRrbpRlGGy84QQX0KoDBBEC9kajBF1SjgEKwawC24VMKRte5DF0gDj2Wn5qgGnrgGbWAFnQ6chRgAmo1XohvQzAwMAAAAAD//xqMIy+jBRAmkIY2XgYjaBtkC+xGAWVg3xAdIg8fXecyZEEHlTcAXIeWS9Q+5r9tkGzhHmyAGofTgQDxbQgGBgYAAAAA//+iZuOFWme96FDJnOEEegbxzb3yo/ceDRtwjoGBwXEIegZ00vS6QeCOUUA6MGNgYEigcrgVQOlpDAwMt6horhD0oshRgAqosfYRtFAXtKuROMDAwAAAAAD//6LG3UYwADoL4jsVTtkDLf7lY2Bg+EehOcMFmENv76UmAF37PpOK5v1kYGBQH+35DlnABO2tUqsHRU9wc3SqeUiDE1S+4HMDAwNDIBIftINpBxXNH733CBWAyo7P0OsBKAGgjhPxh9QyMDAAAAAA//+i5sjLL+hBVpQC7tFrAlDARCqbNxt6Su5uKprJDh36HQVDD7BAG51DseECurfIaBC4YxSQB8Kp3HABXR6bhya2k4GBYSsV7Ri99wgVgOpqShsuIEDamlkGBgYAAAAA//+i9kWIo4t2qQuonbm/QReyMSANrVILjG4nHJrgMQMDg8wQdDloWNgZmqZHwdAD7DQ4K6oDmp7RQTZ0dJhaYPTeIwQYkMW6DAwMDAAAAAD//6J244Va615GGy+QBWzUztxVDAwMr6Fs0LBnA5XNH91OOHSAJAMDw0cqnc8wEKCMBtOpo4B+oILKJ9c+xjP6+xB6uCc1Qd/oRgUwGJjGCwMDAwAAAP//GqwjL6Mn7UIaGtTM3CewTEE1krpIigAY3U44NIAW9DRLviHq/o3QReyjYGgC0JEPxVR2eQWB0ZUOpI4bNYAWDUavhyKg1kDDWZJUMzAwAAAAAP//ouaCXQZoZUuNRZtXRvgljdJUOrEYGVji6KlSe0Hba+glXdQsKEYB9YAN9KZlliEapo+gO9xGwdAFy6HTzNQCJxkYGCyIMAu0UWEGFe39wMDAoMLAwPB2BKfF29AwoAS8gI4EEw8YGBgAAAAA//+i9sjLI+huIUqBFnTh7kgF1O5VrsAzxL6Tyo0XUeh5CKNg8IEgBgaGg0O44fJ99Ob5IQ9sqNxwAYF8ItXNofIuIYERvnUatFBXiQrmkD5jw8DAAAAAAP//onbjhQF6HwqlgGkEn/diTuXM/ZOIA+5KoVsAqQUSR+89GnQAtEZkDRWOMhgoADo6wYqBgeHT8IqWEQWYoWtFqAnmQkdeiAGgMi6TyvaP5DveQB0JapQnpK+VZWBgAAAAAP//okVBNrpol3zATIOt0dOJmMq7At1CTU1/jG4nHDxgI/RmXLzTxIMcZFDx9vpRMDAghcrXTnwm4+TxQ9CRaGoBZhosBh4qYEDuNAIDBgYGAAAAAP//Gm28DC6QQuWt0Z9ImMKph56TQC3gMXpJ3oADDugJo35D3B9NVG5cjwL6AxEaTLHUQi/jJBWUQxs+1AJu0GMtRhoYsJ1GDAwMDAAAAAD//xrMjZeRtuOIlwaXk7WRsHD2FQ22Tk8c3U44YEARGqdD/cDHudCG9SgY2qAZ2oChFrhIwSj1I+hIJDVB5wgs66gxwACaDib9XkQGBgYAAAAA//+iReOFWhc0jrTGSxV0sSu1wA3ouSukgAnQjE0tIA+96n4U0BeEQ0dcqHnZ3UCAvaNb74cF0INO+1ETULrVuofK15nIj8Ct09RovIDKKdC9RqQBBgYGAAAAAP//okXj5R0DA8MzKpgDOjxLjArmDAWgTINbowvIOFXyJ5bjtSkF9dBzHUYBfcBC6Jz+UN1RBAOgXSEug8Mpo4BCQO1FuiugDVtKwE/o9BE1AagDKj5CEguobqbGAZfkzdQwMDAAAAAA//+i1c6D0RumSQOTqWzebugWaHLARirfe0SLk4JHASYAHTh3n4GBIW4YhM3T0S3RwwaEQ69xoBb4Cd05Rw2wksqnNPONoI0KJlQyh7y2AgMDAwAAAP//GuyNl5FQgIEOifOkonmgzJ1LoRl5VL4LZPTeI9oCOwYGhpcMDAwKw8Avn6CHXo3eKj/0AS8N1pZMwHF/EbmA2tNZ0VTedDFYAbXqZvJO5WdgYAAAAAD//xrsjZfhvuOImYx1KYRAPxWO/L9Bg+1/k0bvPaIZAF08xzYM/PEDemYGNXe9jYKBA1VUPg0Z1GhppbJvLlL51F0GGhx3MRjBgG6TZmBgYAAAAAD//xrsjZfhvmg3h8oNtIdUPN22DTp8Ty2gMbp4l2YgHNowBB3AdWyIjlr8hZ4BQs00NwoGDijRYB1fKZW3OMNAHZXNNR8BW6epUW+BboQH3bFGOmBgYAAAAAD//6L23UYwwAY9ypvSxtFX6DzicBxCFoFGHDV3hERA53GpBcKpfKATbEpg9N4j2oNpDAwMCQwMDJxDwK3/oWcCbR4EbhkF1AHrGRgYAqgYlntpvIC7HM+t1OSAR9A1m7RobA00ANXrIH+BrgegBIDWG4Hu3CMdMDAwAAAAAP//otXIyy/oFihKAfcwOKcCF2imcsPlJJUbLgw0WtDWREXzRgFukAUtXPKgF58NZpA52nAZVsCdyg0XBjpsQwatzblORfPkoNNmwxGA6mRKGy4gQPZ6FwYGBgYAAAAA//+i5T0no+tecAMN6J0Y1ATEXk5GKiiksnkZoztJ6AomQ29s1YfeJk3NO6yoAUDnbcwc3EE4CkgE1F4vN4GK54fhA9Qu6wqhjZjhBgb0ZF0wYGBgAAAAAP//GgqNl+FY0c2h8uLV5SRcTkYqAI28LKWymdS+NXsUEAaggsIJemUAaC3Cg0EQZnOh6xhGwfABoE6UJhV98wa6JoUeAHS8xAYq2sMOnb4dbkCbSv4hv43AwMAAAAAA//+iZeOFolYVEqBWQA0WAFpHYk1Ft3ymwWFL6KBg9C6QYQP+QIfIFaGHTK2EitEbbB89PXfYAVkaXHFSQud1I/lUPibCGzqNNpwAtQYUzpCtk4GBAQAAAP//GgojL8NpxxGoJd5NZTNbqXzuATbwBnoJGjVB1+i9RwMOXkIXebNScMkdOeA0AwOD1/AJxlEABZOovI7vOPTEaHqCRzQoo/uG2TER1FjKAaqzQLuNyAMMDAwAAAAA//+iZePlHnS3EKVADbpwdziACioflX+TBufE4AJTKG0powE5GmylHAXkgxbo3Vqgkc5N0N2CtAB3GBgYzEbjadgBai/S/UvDdXyEQBeV73jTGkajjKCFuqA6mVJA2eAGAwMDAAAA//+iZeOFgUqLrJig22uHOgA1Wiqp7IdcKg9x4gN/oYehURNUDtMFbUMZXINuWwYVUj4MDAxnqXhUwQMqr4cYBYMDsNPgYLbZ0BG6gQCfqXgFAQw0U/ni3YECoCkjarQbKFtWwsDAAAAAAP//onXjZXTHEQJQe5pkBZXvICIGnKLyaZTsVD5bYRRQF2yF3mECGvJup/B8nnvQdTYDsb5mFNAWgEZI1KloAy2mqUkFK6m8CUJ0mBwTMeAn64IBAwMDAAAA//8aKo2Xob7uxRS6toBagBY3ohIL6qCHzVELRI7eezQkQBX0JllQY+Yo9GA5YsF96M3po2D4AVClXENlX9XQcf0VPpBP5aMFUqFTSEMZDIpt0gwMDAwAAAAA//+ideOFWjuOjKlkzkCBOVS2t5/Kc7KkgNdUvIIABqh9LsQooB1vOrNYAAAgAElEQVQATSPZQIeOFxIxbXkPelT8KBieoI3Ki3Rv0KC8JBechE5fUQswD4MzjahxaOxv6PQ0+YCBgQEgWl0PAANCDAwMbyk1BHpCqCQVzBkIkE7lqZbX0F7sQB47zQ5dLEzNS9cKRsiFZsMRlEN7qeh59N7oiMuwBlrQDio1d9K4QK8CGCxAFLrInI+K7qH2NS70BM+hRyxQAkBpBnRoJvmAgYEBAAAA//+i9cjLO6hnKQWgwOIfyBgjE/BCd3FQEzQMgvsyftLgksXhsqBtJALQuTFS0F1E+xgYGN5DrwcZbbgMbzCByg2XFYOs4cIA7SxS+5C8oXpMhDgVGi4gQPmMDAMDAwAAAP//onXjhWGEL9ptgl7ASC1wbRANO25hYGDYQUXzeEfvPRryALQ7xBk64krNBZyjYPCBcCqvVftJgx0+1AJTqDHNgQSG6jERg2a9CwMDAwMAAAD//6JH44Va616G2qJdDehWZmqCokF2N00xld2TMQwWtI2CUTASQDuV/dhDh8M2yQV/aXDv0VA8JoJaAwiUtwkYGBgAAAAA//+iR+OFWhdqDbXGSz+Vh1R3QO/eGEzgGpUXtDHQ8dC9UTAKRgF5oBy67Z1a4BENrhWgNthF5ZFmduh061AC1Gq8UD4bw8DAAAAAAP//GkrTRjpUMoceAHSfhQcV7fkLHeUYjIDaW6dBQ9Fhg9Svo2AUjHQgSoPDNsvoeNgmJYDaI80R0J17QwWAjkmgFHxgYGB4RrEpDAwMAAAAAP//otfICzVO6BxKjZdeKps3m8pzrtQEtNg63T1679EoGAWDEjRRefPEySG084YWI81D6ZgIalwLcJEKZjAwMDAwAAAAAP//okfj5Rd0qxmlQAC62nmwg/JheNokITBhdEHbKBgFwx6YQw9aoyYYqPuLyAXUHmk2GSI37IPqNGpsF6fOTAwDAwMAAAD//6JH44VhBJ20C9pZVE1lMwfLaZP4wE/oYmJqgtF7j0bBKBhcYCKV1/EtpfIR/PQAr2mwPgd0RQrH4PQuHAyaawHAgIGBAQAAAP//Gm28UBc0D+PTJgkB0GLiDVQ0DzRtNI02Th0Fo2AUkAjCoCMv1AKfoQdTDkXQT+WRZoUhMAI1qBbrMjAwMAAAAAD//6JX42Uk7DgypcGQat4g2xpNCIAy4A8qmucNvWp/FIyCUTBwgBe6lZmaoHYIjCjjAn9pMNIMuztssAJqNV6os+aFgYEBAAAA//8aaiMvFB8pTEMwlQanTdL71mhKwSMa3BLdN7p4dxSMggEFoIpVlooOuAE9+G0oA2qPNIPWkzQO4vCgxsAB6ILWb1Qwh4GBgYEBAAAA//+i9d1GMABqJH1nYGBgo9Ccf9BI/koth1EJhEMbG9QCoCFV7UF8aBM+AGpo3KZyYVcxBM9EGAWjYDgAWWh+pmYHwmMQnllFDpCDXoNBrbABjejoDcKdpVzQOonSwY5NDAwM/lRxEQMDAwAAAP//YqGWQQTAP+ipepTuEwcFni4DA8MJmruYNEDt7W6tQ7ThwgBdvJtL5V4JaBH08gG8SRsfMINmbmqBZ9ACcTAAUH7lIdMd0ljuqnpHQRz+GET5XonKi8lBeeY4Fc2jJphE5YbL+mHScGGApuU+Kp57wwydnvOiknnUAqBRF2rM0lDrtH0GBgYGBgAAAAD//6JX44UBOnVEjUNu1AdZ46Weyjde3xwGp8xuhDZeAqhkHi905CWSSuZREyym0vkHMPABOj060A01HwYGhs0D7AZ0EMLAwLB2gN0gDb3DSYiKZj5lYGCQoaJ51ALuVMzDDNBG2lBdpIsLgKbJU6h4qawnNNwHUwMPNGBADUC9xgsDAwMAAAD//6LXmhcGKjp8MF3QKEeD0yaLh8hpk4QAtQupCOgox3AHAtBLL8kd8aAG0KfyNCi1wKIBXvcGipNtVG64DGZA7UW6/YN09JQS8IkG53ANtnV+1NooQ7XFugwMDAwAAAAA//+iZ+NlOG6X7qRyIgPdnbGViuYNJHhIg8W7swahP/GuGyMT6A7gCIMi9B4X7gGyHx/ggrpNfoDs3wRdkzASQAmVTzWnxUncgwXMofI6Fa1BNkJFjQGD31SdDmdgYAAAAAD//6Jn4+U8lcwZLDuOrKCjAdQCg/n+InJBG5V7WqC4T6evFwYMuA3A0eHs0MbzYN6yKQadlmSls72gM4ccaWQ2LRrAlABZ6Emy1AS10EWfwxHQaus0taaiKAXUaLxcoKqLGBgYAAAAAP//omfjBbRY7wUVzJGk8t0a5II+Kps3eRDfX0Qu+Ay9dI2aoJlKx1RTC1BtSx4WAOp9+dHRL6CRLU062kcu0Iee9kovANpNmElDu2iZhsgBk6h82Oa1IXTYJrlgJ5VvnQaVcV309QJWALqSR4IK5lB1vQsDAwMDAAAA//+iZ+OFgYpTRwO97iWeyqdNvqZBT2ewgJVUPgKcFrfaUhtEQ3vTpGBcBdVSOjUoQD3HOBxyvmT4B9v89l0yzHHF4aZMGhwKiQ0YMzAwzMchN40M/3jTwc2UAGov0gWBnCF22Ca5oJDK6xUToIefDiSg1jIN6jZeGBgYAAAAAP//onfjhVoeGMh1L7zQW4+pCRqH8ZAqCGRR2bzCAVz3gA6wDfmT05OugK7nQAewRaLCVHMxJvDFcxN6JXQB8UCBPXimU2fRcCqHAZrGQD1qTixyh6BHApAKBtsoCzJgp8GI1gIGBob9VDZzsIIbNJjqpfbhp6SCQblYl4GBgQEAAAD//6J34+UqlcwZyMYLteciQQl+BhXNG4zgHJX9yE6DxcDkAmyVETlrGP5D11DdwyKnQMNFtJYMDAyrcMitHiTh3AcdwcMGNlBxKycyEIKecI2t0QiKoyDo+VWkgsG2vgUZFFD5RnxQh6yUiuYNBdBG5TO6TKFbsQcKDLprAcCAgYEBAAAA//8aqtNGA9V4kYP2+qkJRsqQah2VR5dAFb0tFc0bDOA99PTRj1jcYoSnAicXqEBHdbDdaHsGzzTSQIAEqJvQAWhtwHYaLDIGjTapYhH/CI2jt4MobKgBJGlwI/5Qvr+IXECLBlsLAwODCP28gAKo0XgBrXUFnV9FPcDAwAAAAAD//xqq00ZaVDKHVEDtrdGgszT20sfpAw5e0+A8hBkDPKTKQMVpIxi4DT1CG1uD1ht6+jI1AA90Z5EAFrMeQg/LouYlm5SCH1A3PcFijjSVdyAtho5IoYPf0AXUtykwm1ojddQGfVRepHtzGNxfRC5YSeVyHdRwaaevF+CAGgMF1LqYGQEYGBgAAAAA//+id+PlF3TRHqWAbwDWPJhTeWv0TxrsxBnsYAoNzkMYyCFVBhqtYTgIvVEcG6iCTllQCtbgOBn4M3Sb9mDsMb+Bjnpgu9zNgkpTk6CpkxgccsnQtS7UBgO9DobaZRsDdD3QSBhRxgXyqOz/xAHotIOmELGNypIKqDXjggAMDAwAAAAA//+id+OFgYqtMHrvOKL2QrbuIXx/EbkAlJmzqWxm8wCfh0CrXvM06D0w2MBiCtd5dEF3lWADsYPobiVs4CqeBeBJFG5pdsSzcHkeNNxpAQZ65IXaZdtQvBGf2gDUSZtNRTOZ8aRNWgFqLc+gfuOFgYEBAAAA//8ayo0Xeq57iaby1ujHg2QP/0CAA1Q+eh7UcGkaQP/QchogHscCXi7oQlVyzjuKxDMnPw06/TLYwUI8DYlp0AMkSQXK0MYitjLxKnRtGjUAtacZKQXUPvYBNKJcPjBeGXSgDnp9ALWAB5232lNrgID600YMDAwAAAAA//8abbwQBuw0ONa6dJhvjSYEyql8HkIqlQtgUgAte82foSMk2KZwlKBTP6TYr4vnsLCtNBgVQwfUDCvQYuLDOOTWk7iAlwu6QBdbY/ApNA6+k+lOYsBAjbzw0qDhPxzvLyIX0OJKhC46rvOjVuOF6qfrMjAwMAAAAAD//xqIxstQ23FUQOXr70/TYNfIUAOPqLwAjZkGZ+8QC2jda76DZ52HC/RWc2KAIHS0hguLWtAt7aG09QYYUDusQOfTXMciDmq4rCPBnEU4Cur30DB+SoEbiQEDNfJSRuWybTjfX0QumABdAE8tQM91ftSoY0HlF2ihO3UBAwMDAAAA//8aiMbLdTLPR0AHajiGeKkJRKi8fZAWaz6GKuigcg/NFnqMO70BPaYBzkKnLrGBeiKuEIDdWaSERe4xVD8tRxZoBT5CR0XeYTHfmsg1KqBtqMFYxP9CxW9Q2e2DZbeRHA229BaN8BFlbOAn9JJLagJ6rPMDdXKwLegnFdBkyoiBgYEBAAAA//8aiMbLPxy9JVIBE45zGKgJuqm8fXA+dORlFEAyNbUvM+saZFfJUxNsgBZa2MBy6JktuMAkHFt/v0NHdV4PtcBAAo/xbC2PIXCRpy+ezkneMD8ZltrHPoCuAFlCRfOGE1gDHd2kFqDHOj/QFDM12ge0abwwMDAAAAAA//8aiMYLwxBZ92IKPRiLWuAzdJvrKECAtVTelSAHPWafnoCePek6HAtquaDi2E7gBY3YpOEwL2qYXAZ6BM9R/RNw7MxSwlPZzoQu/KUFGAwLdmmxNTqfyuYNN0Dtw01B6/xouXV6UO80YmBgYAAAAAD//xrqjRcTKpmDDUynsnmtQ7yHSytQQOXzECqpPI9PCNC7MorBkX+0oKMzyIv5bKBbfLGBGqj64QKmQ+86Qgcc0AayNJK4MPS6BWy3kx+l8dTuYJg2osXWaGpevjocwQkq77IE5XNaHgI4qHcaMTAwMAAAAAD//xrqjRcdKpmDDuKht8lSCzyC9gBHASag9nkI7NAh8YEEtKyMvkCnSbBdIeCCFJYa0HUubFjUraLiSb2kAFpX0unQURh0IA5twHBDL1ncBd0ajQ7uQ6eSaHm42kCf6TK6NXrgQAWVd1mCziWi1To/ajReQAt1qb1mDAIYGBgAAAAA//8anTbCBKA1Lj1UNrOMyol2uIE6Ko9KgYbEXekURtRYfC6AYxcQLgA6+yUMh1widORgG46RhcvQCowUQK2RLHJGpKSJUIMMQKcPP8MirgldczYNek8UOvgGbRS+J8EuWRLdhgvQa9qIlwYN+9Gt0cSDhzQ45p/aa5dggBp1K7U252ACBgYGAAAAAP//GqjGyx3oVQGUAgkyD+rCB5qofAnW/tGt0QQBqOHSSGUzJ9DpPARseYjUykicjNNbd+FZQwUaTlbEIv4eurOIlDuLyqB3Cg0UWAa94ZlY8BrP9QmheNaxxZI4P29G5vb8gZw2aoKmNWqBx6Nbo0kG1N5lCbomBzT1Tk0ASiOgupVSQLP1LgwMDAwAAAAA//8aqMYLAxUvaaTmNQEmeBb+kQP+UvFkzuEOZgyje4/IyVdBZAy/t0Mrd2IBaErkAQnqXSnoqWOrkMmppOWg01ykgJPQxgixoIHEc2FEoOrJ6fEOVJlL7bKNYfSwTbIALe60A3ViqLl1etAv1mVgYGAAAAAA//8ayMbLYDysbjqVe+uzh8luDnqAvzTYOj1Q9x6RO1QK6pV5kagnmsjt97HQxajEAjXoFk9yAbYRBnKnR5zJWGS6hMgrOFaRMeq3mYzpLBjAljZoPW3ETIOybe/oiDLZYCWVFziDpoepuXV68DdeGBgYAAAAAP//Gg6NFz0qmRNL5d1Ln6FrOUYB8WAnAwPDDiqGl+gADWtTMg2wiozDoUIJ9IDnkHgGBw+eNTOUAErCJQ+6nocUUE6gwXaTDDOXQm+wJhdQa0SKFJBC5bJtdESZcpBP5YXhGQwMDIZUMotasxnUml3BBAwMDAAAAAD//xoOjRdsi+9IBex4DgAjF4xujSYPFFN5cXMKFTM1sYCSnjQ39PwbUsBD6BZqbOAC9EwIUsACHLtxBjJcGKCLbbVJ1BOB426or9CpOmzXLuACidCzcSgB9D7ThR96ijA1wXRa7iIZIeAkdAE5teOFGoAajZcPDAwMT6jkHkzAwMAAAAAA//8aXfMCAQXQhU/UAk8GwXbdoQpA02yTqex2Wh04hgtQ2pPWgd63QwrYBD27BRk8JWMaKh/HcfmDAXBAL10kZZH+E+haH3QQRuKULmiEdyoVwoDe5wI1UHkDwhsaLK4fqaASR8OaXADaAk/p1mlQm4AasxkXqWAGbsDAwAAAAAD//xrIxssrHHeSkAoEKFxBL0qDk2+pfZfFSANNVB61sqDzvUfUqIxiyVjA24o2agPaWfScBP2uQ+A8IlUy1uKADghLQuKXQqfFiAXC0DNzOKngfnruNtKgwSLdEipXuCMZvMHS4aAUgNZ5UXKlDSh/kXJsAy5A0ykjBgYGBgAAAAD//xrIxgsInKeSOZQsMGqi8tz+6EI2ysFnGlwaR6vzELABauUr0AJebxL1xENHFOIYGBjOkaCPnEYBPkDLtR0uZIzOzYeewLuCjHOcQA0dGRL14AL0LHOnUHmR7hkGBoaFVDRvFEDWo1HzvjvQ7jxKOuPUWqxL28YLAwMDAAAA//8a6MYLtTxIboDrQRc6UQuMLmSjHlhI5RX5tDgPAReg5jTAMhy3QeMCX6EjTaScGwNaoLuFyo14au42wgZy8KzzwQVAJ/Amk6hnDvRMF2oBWocLDIRDd2lRC4DKtkwauHOkg780uI4CdJIvKWUGMqDWYl2a7jRiYGBgAAAAAP//GujGy0Bvl6b2EPns0YVsVAXUvuytisprm3ABalZGfND1LNguXcQFSD17YxmVrr+nN1hMRt4nZYFuJhmNHUKAHtNGtLgiYwJ05GUUUB+ARl7mUtlUcq//GBqNFwYGBgAAAAD//xouIy/kBHg89G4IaoFPo1ujqQ5OUjlT89HgeG56ANAOm9U0WhvRiGNB61AB22h0lo81DRaO0wvkU7mRPrpIl/agElqHUAuAdtmRs6WfGtNGt0nsJJAOGBgYAAAAAP//GgwjL9S4+0CVRPX8NLi/qG10azRNALUzdSSVh9OxAVo0MjxpsJ0/eBg0uCVpcDs2qOLfSKPrJWi92wjUkKumonkM0EWloyfp0ha8psGZVKB7p0gBoIW61BiBpfl6FwYGBgYAAAAA//8a6MbLL2grjVIAGlJXJ8GMCipvH3w4ems0zQAtMjW1FzKiA1ptfQVVSgFUMkuLjPuUBiuwgp5NQw3ACR3NEaaRX2k9bUTtDQinoet+RgHtwQRoXUItABp5Aa3zIhboUmlBOe0bLwwMDAAAAAD//xroxgsDFT1qTKQ6BRos3CwfvTWapoDamVpjCC+sXgY9B4YSIAo9yZgaW38HC4inwhopRuhuJK0hGgZaZBxISAhkU/kk2FGAG/ykwTo/0HQfsVunSZ3BwAVofsYLAwMDAwAAAP//Gk6NF10i1dVDD7uiFjgxujWa5uAnGWeeEALNVLphl2ZXvkNPx0UHnNBrFKTINJMZurNIFosc6Nbpu+Q7FwXQ8uA1bOECAr0MDAweFJhbCz0bBxs4RYG5hAC1wqqTyiOKK6i8jXcUEAYbqXxFCqiMI3brNKmnV+MCtB95YWBgAAAAAP//GgyNF2qtSiZm0a4xnivxyQF/aXAI1CjADlZCz9ChFuCFVnaUAlqeZxKGYx2VFDQsSDlpFgYm4Nn6C1oD85IMM7EBWt7XAzrufjcWcWbobc/EjsIiA288i1JboQ0+agBahUsIAwODDxXN+wmdXh8F9AelVB7tAsUjMWtZKB3RBQHQQt37VDAHP2BgYAAAAAD//xppjZcZVLILBmaPbh+kK8ihcqaOpvCSPVqDxwwMDIE47ACl9+Uk2p+AZ7oMND2wf/B4HS/4C23Y3cOiiBPa0CBlB5IqdDoOG9hMg1NQqQ14yFicSQj0U3mqdhQQD67QYD0aMVekUOPyTlyjotQFDAwMAAAAAP//GgyNl3vQg7UoBRoEzsKIp/LNqm+gw8yjgH7gBg22r1K70Geg8pTJUTwNGE8STiK2hJ4wiw00DMD9T5SCD9BdY9hGiiSgDTtiRjkEGRgYduFY5HoE2kiiJqDFdFozFU8AZoCO9g3FIwWGEwCNAv6gon9AeQXfnWWgUVxQvqEU0Px8FzBgYGAAAAAA//8aDI0XELhKJXNwjb7QYmv06B0fAwPqoCMS1AKU3ntEy2kjGNiA59Ax0F0mDgT0K0FHI1ixyO1Bmy6hZZlA7XB5AI07bA0CZyK3lm+ALuJHB2+gjUZYBUKtcKF2elGnwdR1DZWPJxgFpIMHNOhY4dsRS40pIxCgT+OFgYEBAAAA//8aLI0XankYVwRQe2v06dE7PgYMfKbBXDwlW7FpuTAVGYD8fACH3Do8c9oC0AWAQljk7kIPs0IGtFyATIuwOohnWqcaesElLrCUgYHBDodcEFrnZLCGyxwqL9K9SYPTXkcBeQA0+vWIimEHGp3DtfFhaDVeGBgYAAAAAP//GiyNlytUMgfbyAvooqpCKpkPA6OLdAcWLIPu8qIWUIIuAqUWoFWDxg9H4SAI3YEkiCbOCj2zBNsWyLfQW6Tf0sit9ARteKbE5kKnzNABqMEThUMPaPHrYRq5n5ppAzSlZUNF8xigVyKMbo0eHADUUSujsktAO4+wrQcbMhcyggEDAwMAAAD//xpuIy/Ydhl0Ufk24RVUvjBwFJAHCqlcyJZAG7rUALTaUfIZekgdtjViClhOmp2Oo+JmgI4s0GVXAJ0A6DCu41isAjXgtjIwMCgiiQXimVIC7SxaS0MnUyttgMq0biqZBQMrhtCi7ZECVlK5vgGt7cI2HUXODj108BS6Fo32gIGBAQAAAP//Gm6NF/SzXswpXM+ADmhx3sgoIA+cgO72ohYAVQYTyTCLlluCsYF7eNK0HVLBlIbnUkFQQ+0QDrmhtOYFHYBGTN5hEReETq2BznfSxLOTYw+e6xIGW7gUULGxzUCjXv4ooA7Ip/EuS1DapsYZL3QbdWFgYGAAAAAA//8aLI2XVzgKHVKBBPSuExiYQmV3dlN5DnIUUAYaqNzSB41quJOohx63BKODrXimuQqgcjNxyK8lcL4NLdd20Bo8g44oYQMG0DDZhmNX4gNo4weX/6kVLtS420iOBvcXtVJ5IfwooB44SeWOGggglwGgUUnQvUaUAmot/yAMGBgYAAAAAP//GiyNFwYqttr0oHQ6lbdGv4ZOQY2CwQNA22Q7qOwaUlf4Y6uM6NEAqIduo8YGcFVsdxgYGOIImEvLMoEei5sP4jlRNA7HzqLfDAwM/gwMDB/xmEutcMGWNkht7LaRcOQ7MeDG6N1sgx7UUflyTNB9YLARXGrVk3RbrMvAwMAAAAAA//8aTI0XanncADqvR+0r3GtHb1YdlIDa9x5pDpGpwX/QkaIHRKr/BD0XhuZX1Q8C0EHiupVYeg95UwBMocP+1AQFo3ezDXrwmgbnioE6aqBDHYk54JUYQL+RFwYGBgAAAAD//xpMjRdq7jhqpNK9NTBwbfRm1UELaHGZGa4V+djAQEwbwcAbaIPkOwF1IHkv6MgLITCUp41gABQnMUSe9llJ5N1kg2HaCLQleiqV3AEDG6A71UbB4AdToHURtQBoiQVoRIca26RB+YN+jRcGBgYAAAAA//8ajo0XNxrcGj16s+rgBhuhiy2pBUAjd00UmEWvs18YoEP+SQTU+OOZYhqu4Af0RFF8h6310mDakRCgJG2kQEdeqAV+Qhtvo2BoAFAdVERll4LOj8J11hEp4BZ0+pU+gIGBAQAAAP//GkyNF2pdo03ubbu4wAo8h4ONgsEDcqk89J3BwMCgNUTidwWetTpNOC4xHAngHpZD+GDgBHTX1VABvDQ4sr8f2vgdBUMH7KTyrdMgIEYFM+i63oWBgYEBAAAA//9iobeFeMBX6E4eam7/oxSMbh8cOuAGtDCm5um7E6AjefgAPUdZ8IEi6Gm6SkhqXkMX9pICqOWfwRIu26Ejp+h3FKWTaM5A+6cJyyGElIA3FJ4sPQoGDhRDD5ik5snKlAL6Nl4YGBgAAAAA//8aTI0XBmgADKbGy+j2waEF2qCLGWWp5GpX6Ip8fGsisI1e0vvsFxggNH1EDKBWgUiPO5+IBdOocPHkQIaLFg1O9a4c3YAwZAFo3csMaKN8sAD6LnhnYGAAAAAA//8aTNNGDAPResMDRrcPDj3wmYRblokFXQS2pWLrkQ+WUQdywFC724hegFrhQk566aVyL/vM6AaEIQ9AjU/QyOpgAfRtvDAwMAAAAAD//xptvOAGo9sHhyag9nHacnjODRkFo4DWAHRoogcV7fgLvb9oFAxtQIuOGrkAdPwCfa8aYWBgAAAAAP//Gm28YAc7RrcPDmlA7eO0C/GchTBQUyG0AoOtTBgsYCCuByD3ygp8YDZ05GUUDH2wcJDcs0etzTbEAwYGBgAAAAD//xptvGAHo4t0hzYAZeh5VPQBO57dPAN5zgstwHA454UWYCDOeQEtPlenol9e47m7aRQMTUDtY0HIAfRvvDAwMAAAAAD//xqMvayBbsDMGGTTV6OAPFBD4IwPUoEH9LwUdECNu2oGExgdecEOqBUuxDZ2laB3d1ET1A6ydRKjgHIA2vIPOiphIAH9T6dmYGAAAAAA//8abbyggk+jPZNhA17RYCvoZOgoDDIYyg0VbGB05AU7oPdC5lYq2zF6SvjwBaARuoFcn0n/xgsDAwMAAAD//xqMjZeBvGOkc7RnMqwAaL3AEyp6SBbLOTLDbc3LcPMPtQA9w8Ucz+F65IKi0VPChy0A3e1G7QMMSQHn6W4jAwMDAAAA//8aHXlBgJto14SPgqEPQEfE51DZFw1oB8ENtzUvw20kiVqAWuFCTNqYQmW3j95fNPwB6JoLal5QSywA7TKi/2WvDAwMAAAAAP//GmyH1DEM4MhLxujW6GEJQPcerWFgYAihoudAQ/qReORB621SSTCPiwpuoiUoImMkQBmLGOjqjv0kmiNBf+8SDWzI8I8wAXnQyb8mVHZnMZXNG4S2tioAAB62SURBVAWDD4DqrmoGBoYldHbZwNTXDAwMAA3GxgtomP8LAwMDDx3tHL2/aHgD0B02vljWq5ALIqA9nYs4etKaUDwUAbbRWDUophSArt93GEbhIkIl/8DSkDgN1rp0QO94GgXDHyyFnsQMmnakF6DrTdJwwMDAAAAAAP//Gqw7C+g9dVRNZ/tGAX0BaDi1m8o2wswbXbA7MgA9FuzWEzEyQwp4QoPG0CgY3CCLzq4bmMYLAwMDAAAA//8arI2Xq3S0a7RnMjJAN5UXY4PuPUoe6YE6CqgG9Ghw8m0JdBR7FIwccA563Ae9wMA0XhgYGAAAAAD//xqsjRd6Bch96N01o2D4A9A2+DQq+xJ0cN1gnHodBUMPtFDZxccIXCg6CoYvAG0qAG1WoAcYmMYLAwMDAAAA///Cu/L9//8BGxF3YmBg2DtQlo+CUTAKRsEoGAWjAC8ALdbVH5AgYmBgAAAAAP//GqwjLxcGgRtGwSgYBaNgFIyCUYAdDMi1AGDAwMAAAAAA//8arI2XdwwMDM8HgTtGwSgYBaNgFIyCUYAJBm6QgYGBAQAAAP//Gsz3mNBz0e4oGAWjYBSMglEwCogHA7behYGBgQEAAAD//xptvIyCUTAKRsEoGAWjgFQwcPcQMjAwAAAAAP//GsyNl9GbnUfBKBgFo2AUjILBB94O6NIOBgYGAAAAAP//GsyNlwG57GkUjIJRMApGwSgYBXjBwA4uMDAwAAAAAP//GsyNl3NQPApGwSgYBaNgFIyCUQABDAwMAAAAAP//GsyNF4bRxssoGAWjYBSMglEw6MDAjrwwMDAAAAAA//8a7I2X0UW7o2AUjIJRMApGweACA3sWGwMDAwAAAP//Gm28jIJRMApGwSgYBaOAFAA6XXfgAAMDAwAAAP//GqzXA8CAEHRV8ygYBaNgFIyCUTAKBgfA23agOWBgYAAAAAD//xrsIy+gk3ZfDAJ3jIJRMApGwSgYBaNgMOwEZmBgAAAAAP//GuyNFxDYNQjcMApGwSgYBaNgFIwCBoajAx4GDAwMAAAAAP//GgqNl3gGBoaeQeCOUTAKRsEoGAWjYCSDNgYGhtwB9z8DAwMAAAD//xrsa16QQTADA8OaweOcUTAKRsEoGAWjYESAzwwMDKEMDAw7B4VnGRgYAAAAAP//GkqNFxAwhU4jCQwCt4yCUTAKRsEoGAXDHYCuAXBmYGC4Pmj8ycDAAAAAAP//GmqNFxDQYWBg2MHAwCBNJ/veDPTtmaNgFIyCUTAKRgEU6EF34tID3GdgYLBjYGB4MqgCn4GBAQAAAP//7NsxDYBAFAPQZwE/aEDCbdgiaMABlk4AISeA9edI+gx06NKlfxwvw4ILa0HWgx1HQVZERMSXhrPoqnxjQ5+uDbwAAAD//xoKC3axgfcMDAxODAwM6+hgFyiM5jAwMLQzMDAw08G+UTAKRsEoGAWjABkwQxfL0qvhsho6VTQoGy4MDAwMAAAAAP//GqojL8hgKgMDQxad7NrLwMAQPnpw3igYBaNgFIwCOgEJBgaG5QwMDA50sq+bgYGhbFBHLgMDAwAAAP//Gg6NFxBIZmBgmMLAwMBBB7seMjAw+DMwMFykg12jYBSMglEwCkYuMGNgYNgIbcDQGnyHTksN/l29DAwMAAAAAP//Gi6NFxAwgK6DkaWDXV8ZGBgiGBgYttDBrlEwCkbBKBgFIw94MjAwrGdgYGCng89vQTvlN4ZEKDMwMAAAAAD//xqqa16wAdAtl0YMDAxn6WAXNzRRRdDBrlEwCkbBKBgFIwskMTAwbKZTw+UIdIRnyDRcGBgYGAAAAAD//xpOjRcG6LZmGzqNiLBA5yHL6WDXKBgFo2AUjIKRAZoZGBjm0mmDyCLo5pePQypkGRgYAAAAAP//Gk7TRuigi4GBoZROdm2HLuT9TCf7RsEoGAWjYBQMLwA6u2UJdLqIHgDU8QbVk0MPMDAwAAAAAP//Gs6NFwbo4qN5dGrB3oZeYXCZDnaNglEwCkbBKBg+QBc6YyBHBx/9YGBgiKbTUSO0AQwMDAAAAAD//xrujRcQcIQu5OWhg13fGBgYQqAjMaNgFIyCUTAKRgEh4And4cNFh5ACLa3woNPaUNoBBgYGAAAAAP//Gm5rXrCB/QwMDBYMDAyP6WAXF3SRVRId7BoFo2AUjIJRMLQBbGEuPRouoLuJTIZDw4WBgYEBAAAA//8aCY0XELjKwMBgyMDAcIwOdjFDF1vV08GuUTAKRsEoGAVDD4BmPXrouDAXdBs06GJj0DllQx8wMDAAAAAA//8aKY0XBuipuPYMDAzz6WRfA3TxFSed7BsFo2AUjIJRMPgBJ3SnajEdXApa+wHavQSamgKdTzY8AAMDAwAAAP//GglrXrCBdAYGhskMDAysdLDrIvTwn2HT4h0Fo2AUjIJRQBaQh56Yq0+H4AOdmBs2LA9TZWBgAAAAAP//GqmNFxCwhS7kFaCDXW+hiWgfHewaBaNgFIyCUTD4AOg8lVUMDAzCdHDZEwYGBq9hu/uVgYEBAAAA//8aSdNG6OAwdB3MHTrYJQy91DGPDnaNglEwCkbBKBhcoAhaB9Cj4XIael3O8D22g4GBAQAAAP//GsmNFxB4wMDAYMzAwHCQTvZNhE5X0WOB1igYBaNgFIyCgQVs0LWPvXRyxWroKfOg0f7hCxgYGAAAAAD//xrpjRcQ+MTAwOBMx4W8OQwMDFsZGBj46WTfKBgFo2AUjAL6Az7oUR3RdLAZtMajGro84dewj2sGBgYAAAAA//8ayWtesIFcBgaGSXSy6xoDA4MvAwPDPTrZNwpGwSgYBaOAPkABelipBp3sC4JeFjwyAAMDAwAAAP//Gm28YAJ6nnYIGtoLgN7qOQpGwSgYBaNg6AMr6GYQeqxvGTYn5pIEGBgYAAAAAP//Gp02wgSg1rI1AwPDazrYBVvIG0cHu0bBKBgFo2AU0BZEQ6eK6NFwuQVdszniGi4MDAwMAAAAAP//Gm28YAcXoKcR3qSDXaAFXQsZGBg6oKcujoJRMApGwSgYWgBUdrdBF+ey0cHloNF6MwYGhkcjMp0wMDAAAAAA//8anTbCD0CLajcwMDA40Mk+0C2fsdALHkfBKBgFo2AUDH4AWmKwDHoYKT3A4hE/Ws/AwAAAAAD//xodecEPPjIwMLgxMDAsopN9QdBpJBE62TcKRsEoGAWjgHwgxcDAcJSODZf60YYLAwMDAwMDAAAA//8aHXkhHlRAhwXpMbVzD7oT6Rod7BoFo2AUjIJRQDowhB69L0WHsANtf45nYGBYMRpPDAwMDAwMAAAAAP//Gm28kAaCoBdq0WNOEzTqEw69DXQUjIJRMApGweAB/tCpInrsSn0P3QV7cjT+oYCBgQEAAAD//xqdNiINgNak2EG3p9Ea8EMPs8sZImEzCkbBKBgFIwFUQs9UoUfDBbSjyGS04YIGGBgYAAAAAP//Gh15IQ/IMTAwbGNgYNCmk30TGBgYCulk1ygYBaNgFIwC7GAOAwNDMp3CBrT+MRg6Cj8KkAEDAwMAAAD//xodeSEPgLanWUCvNqcHKGBgYNhBp5b+KBgFo2AUjAJUwA8tg+nVcAHdg+c+2nDBARgYGAAAAAD//xodeaEc1DEwMDTQaSHvWehc61M62DUKRsEoGAWjgIFBmoGBYRcDA4MWHcLiJ3Rh7srRcMcDGBgYAAAAAP//Gm28UAf4Qw8n4qGDXU+h27dHdyKNglEwCkYBbYExdIRdmg7h/By6MPfiaJwSAAwMDAAAAAD//xqdNqIO2Ag9kfcBHewCZaJj0CHFUTAKRsEoGAW0AaAy9hCdGi4nGBgY9EcbLkQCBgYGAAAAAP//Gm28UA/cgO77P0QHu2A7kTLo5blRMApGwSgYQSADWsbSY53hfAYGBks63ac3PAADAwMAAAD//xptvFAXfGBgYHCh00FCzAwMDNOhmJmenhwFo2AUjIJhCtjoWK6C1mVUMzAwJI0mJhIBAwMDAAAA//8aXfNCOwBKlM10Wsi7B7ql7tNAeXYUjIJRMAqGOADdBL2JgYHBig7e+AG9gXrdaKIhAzAwMAAAAAD//xptvNAW0PNEXtC0VSCUHgWjYBSMglFAPNBgYGDYzsDAoECHMAMdcuoB3T06CsgBDAwMAAAAAP//Gp02oi2Ancj7ng52aUBPYXQaSA+PglEwCkbBEAO+0LKTHg2XW9AdTKMNF0oAAwMDAAAA//8abbzQHpyEHu9MjxERPuh5BGUD7elRMApGwSgYAqAEuluUjw5OBU3vm0EPOR0FlAAGBgYAAAAA//8anTaiHwBljrXQBb30AEuhC8F+jYCwHQWjYBSMAlIAJ3SXTzidQm0y9IqXv6OxRAXAwMAAAAAA//8abbzQF4BGunqhx/3TA4DOgwllYGB4NkLCdxSMglEwCggBeehoiz4dQuoPAwNDGrShNAqoBRgYGAAAAAD//xptvAwMSGRgYJjFwMDAQgfbn0EbMMcGY0CMglEwCkYBHQHoTrot0J1FtAagtY4+o2UvDQADAwMAAAD//xpd8zIwANQKt2dgYHhLB9ulGBgY9jMwMMQNxoAYBaNgFIwCOgHQ1uSDdGq4gNY4Go02XGgEGBgYAAAAAP//Gm28DBw4Bl3Ie50OLgBt1V7IwMDQQadzZ0bBKBgFo2CwAFCZ1wa9f44ex1Zshy7Mpcd1MSMTMDAwAAAAAP//Gp02GngAusxxDR3vKgJt345lYGD4NpgDZRSMglEwCqgAQMf7L4NenksP0M/AwFAMPT13FNAKMDAwAAAAAP//Gm28DA4AGgGbwcDAkEon15yFHpL0ZrAHzCgYBaNgFJAJpKDrWwzpEIB/oeX36MJcegAGBgYAAAAA//8abbwMLpDDwMAwgU53Fd1jYGAIYWBgOD+UAmgUjIJRMAqIAAbQixWl6BBYoGtZ/KDraUYBPQADAwMAAAD//xptvAw+4A6dRuKhg8tAU0dR0G2Do2AUjIJRMByAP3SqiB43QoPWtbgyMDDcGU05dAQMDAwAAAAA//8aXbA7+MBOBgYGczqdwgjK3OsZGBgqh1ogjYJRMApGARZQDi3T6NFwOQbdUTTacKE3YGBgAAAAAP//Gh15GbxADHrDqTmdXDh6Iu8oGAWjYKgC0C6iedDt0PQAC6DndY2CgQAMDAwAAAAA//8abbwMbsAG3d4XSidXHoPO3dLj/JlRMApGwSigBhCGdvSs6BCa/6CjOz2jMTeAgIGBAQAAAP//Gm28DA1QzcDA0EynM1ruQE+FvDkcAm4UjIJRMKyBNnRHET1uhP4CvQtp22iSGmDAwMAAAAAA//8abbwMHUDPRWig1fPB0FtQR8EoGAWjYDACF+hlt/S4EfoxAwODG/Tk3FEw0ICBgQEAAAD//xpdsDt0wEbo+hd6XLIIKgx2MDAwZAyXwBsFo2AUDCtQDi2j6NFwOQY9K2a04TJYAAMDAwAAAP//Gh15GXpAAjpsSY+Dlxigh+fljF7lPgpGwSgYBIDeC3NBdiWPRvwgAwwMDAAAAAD//xptvAxNwMHAwLCIjgt590CnkT4Nt4AcBaNgFAwZQM+FuaDOWhkDA0PfaPIYhICBgQEAAAD//xptvAxtQM+FvKAhU2/oybyjYBSMglFAT6DBwMCwmYGBQYUOdo6u+RvsgIGBAQAAAP//Gm28DH1Az4W8oLuQAhkYGI4M90AdBaNgFAwaQM+FuaMn5g4FwMDAAAAAAP//Gl2wO/QBbCHvYzr4RISBgWEvAwND3HAP1FEwCkbBoAAZdFyYe3D0xNwhAhgYGAAAAAD//xptvAwPcAW6gPc0HXwDWjC3kIGBoYNO01WjYBSMgpEHQGXLdCimx0W1UxkYGJwZGBjej6a1IQAYGBgAAAAA//8anTYafmAxAwNDDJ18tY6BgSEWesHjKBgFo2AUUANwQafC/ekUmukMDAyzRmNuCAEGBgYAAAAA//8abbwMT9DAwMBQTyefnYUWMk9HWiCPglEwCqgOpKFT4cZ0CFpQpysIehnuKBhKgIGBAQAAAP//Gm28DF8AOgdhPgMDAysdfPgUevrktZEa2KNgFIwCioExtOEiTYegfAktsy6NRtsQBAwMDAAAAAD//xpd8zJ8wVLoqvmPdPChNPQUSveRGtijYBSMAooAqOw4RKeGyyVoQ2m04TJUAQMDAwAAAP//Gm28DG9wELoT6SEdfMnPwMCwFXoa7ygYBaNgFBALcqBlBz2OewBNEVmOTnMPccDAwAAAAAD//xptvAx/ALod2pSBgeECHXwK2hUwmYGBoXukB/ooGAWjgCgwGYrpsaNoNgMDg9foBoNhABgYGAAAAAD//xpd8zJyAL1X8IPmrqNGC4pRMApGARbABz14zoUOgQM66r+EgYFhwmhEDBPAwMAAAAAA//8abbyMPAC6TqCGTr4+D13N/2CkB/ooGAWjAA4UGBgYtkOP/Kc1GD3qfzgCBgYGAAAAAP//Gm28jEwAutBxCfTAOVqDtwwMDH7QBb2jYBSMgpENrKCXKwrTIRRGj/ofroCBgQEAAAD//xpd8zIywWoGBgYbBgaGV3TwPaiQ2k/HK+xHwSgYBYMTZEDLAno0XI6NHvU/jAEDAwMAAAD//xptvIxccBp6pcAVOoQAG3SkZ3Qh7ygYBSMT9EOP+qfHaC/ofCv70aP+hzFgYGAAAAAA//8anTYaBfReyLsHOgf9acSH/CgYBcMfgEZZVjEwMDjRyaeFowtzRwBgYGAAAAAA//8abbyMAhioh2J6XLZ4g4GBIRBKj4JRMAqGJ1CHnqsiTwffvYWWKYdH09IIAAwMDAAAAAD//xptvIwCZODDwMCwgoGBgZsOoQIaeYmDbqkeBaNgFAwv4AM95ZuPDr66ysDA4MHAwPBkNA2NEMDAwAAAAAD//xpd8zIKkMEW6LHZ9DiRF1SobWBgYCgYjYFRMAqGFahjYGDYTKeGyzroIZyjDZeRBBgYGAAAAAD//xptvIwCdAA6kdeAgYFhH51CBrSQbyGdFvKNglEwCmgHYAvzG+kQxv8YGBiqoevnvo/G6QgDDAwMAAAAAP//Gp02GgX4QC8DA0MRnULoCHTO+s1ojIyCUTDkgDD0/BYrOjgcNOUczsDAsGM0mYxQwMDAAAAAAP//Gm28jAJCIImBgWEWne4euQc9VOreaKyMglEwZIAG9MRcBTo4GHShohsDA8O10eQxggEDAwMAAAD//xptvIwCYoALdGEtPW59fQPdtj16Iu8oGAWDH7hA7yiix/qWS9CGy8vRdDHCAQMDAwAAAP//Gl3zMgqIAaCzWawZGBhe0CG0RKCncMaNxswoGAWDGmRAp27o0XABbbm2HG24jAIwYGBgAAAAAP//Gm28jAJiwQXoqv6rdAgxNugi3g46nTszCkbBKCAeMENPy51Op+nk2QwMDF6jN9SPAjhgYGAAAAAA//8anTYaBaQCXuj2RHpcZc8AtSt2tOAaBaNgUAA+6DQRPfI/aEdRKQMDQ99o1I8CFMDAwAAAAAD//xptvIwCcsEMBgaGdDqF3lkGBgZfBgaG56OxNQpGwYABOej0jQYdHADqrERCdzCNglGAChgYGAAAAAD//xptvIwCSgBoznsSAwMDKx1C8Sl0Ie/Z0RgbBaOA7sAQeoilFB0sBh2S6Q49c2oUjAJMwMDAAAAAAP//Gl3zMgooAaDRFwfovSK0BtIMDAyHGBgYgkZjbBSMAroCf+g5TPRouByGHpI52nAZBbgBAwMDAAAA//8abbyMAkrBMWiv7AodQhK0VXsNAwND1WisjYJRQBdQycDAsJ5OxySARnEdGRgYPoxG7SjACxgYGAAAAAD//xqdNhoF1AKgwm0ZtJdGDzCPgYEheTT2RsEooBlYSKcjC34xMDCkMDAwLB6NylFAFGBgYAAAAAD//xptvIwCaoNG6MVs9AAnoNNIowt5R8EooB6QhO7ys6BDmL5jYGDwhublUTAKiAMMDAwAAAAA//8abbyMAlqACDpetvgc2oAZLfxGwSigHDhBL1eUpENY3oHa93g03kYBSYCBgQEAAAD//xpd8zIKaAFWMDAw2DEwMLynQ+iCCtnjDAwMqaMxOQpGAUUgj4GBYS+dGi4HGRgYjEcbLqOALMDAwAAAAAD//xptvIwCWoGTDAwMJgwMDLfoFMKgyyP7R0/kHQWjgGTACM07E+kUdPMZGBicobdDj4JRQDpgYGAAAAAA//8anTYaBbQG/NDzIWzoFNKroSfy/hyN2VEwCggCduhC2VA6BBXoxNxyBgaGntFoGQUUAQYGBgAAAAD//xptvIwCegFQbyuBTnYdhO56+jgau6NgFOAE/NDb4u3pEETfGRgYwhkYGDaPRscooBgwMDAAAAAA//8anTYaBfQCidDzWejRIraHnj+jNBq7o2AUYAUK0EXu9Gi4vITuXBptuIwC6gAGBgYAAAAA//8aHXkZBfQGoJ1By+m0E+kNAwODx+iVAqNgFKAAK+idQcJ0CJZL0Buhn45GwSigGmBgYAAAAAD//xodeRkF9AbroDuR3tDBXhHolQIBo7E8CkYBGEQxMDAcpVPDBXSJo+Vow2UUUB0wMDAAAAAA//8abbyMgoEAJ6HbJOmxE4kL2mBqGd2JNApGMGCEHiC5lE5BMBk64vJtNNGNAqoDBgYGAAAAAP//Gp02GgUDCfgYGBjWMjAwuNDJDRuhPc/RAnUUjCTAB220+NDBz38YGBiSRo/6HwU0BQwMDAAAAAD//xptvIyCgQag0b8uBgaGYjq54yJ0J9LD0ZgfBSMAqDIwMGyF0rQGb6ENpNHTrkcBbQEDAwMAAAD//xqdNhoFAw1AZz+UMDAwxEAvaKM10Icu4PUejflRMMyBFzSt06PhcpWBgcFgtOEyCugCGBgYAAAAAP//Gm28jILBApZCD7J7RQf3gBYrboDewTQKRsFwBKnQaVJeOvgNdAilKQMDw5PRlDQK6AIYGBgAAAAA//8abbyMgsEETkN7b+fo4CYW6JbtltEUMAqGGWiHXpfBQgdv1TIwMPhCD6EbBaOAPoCBgQEAAAD//xpd8zIKBiPggF7u6E8nt12j04jPKBgFtAYSDAwMGnSw5wd05HLjaIyOAroDBgYGAAAAAP//Gm28jILBDECjItWjMTQKRsGgAq+ghz+eH42WUTAggIGBAQAAAP//Gm28jILBDkAXxi2h04m8o2AUjAL84Dx0R9Gz0XAaBQMGGBgYAAAAAP//Gm28jIKhAED3omxjYGAQHI2tUTAKBgyArhSIHD0naRQMOGBgYAAAAAD//xpdsDsKhgI4Ad3NcHc0tkbBKBgQMAl6zcZow2UUDDxgYGAAAAAA//8aHXkZBUMJCEHvSzEZjbVRMAroAkCVQDoDA8Ps0eAeBYMGMDAwAAAAAP//Gh15GQVDCbxjYGCwHd3hMApGAV0AaEeR32jDZRQMOsDAwAAAAAD//xptvIyCoQZABWogAwNDE7RXOApGwSigPngIXWu2ZTRsR8GgAwwMDAAAAAD//xqdNhoFQxn4QE/m5RuNxVEwCqgG9jEwMAQzMDB8GA3SUTAoAQMDAwAAAP//Gh15GQVDGYB6hUYMDAw3R2NxFIwCqoAOBgYG19GGyygY1ICBgQEAAAD//xodeRkFwwHwQLdxOo7G5igYBWSBX9Bt0OtGg28UDHrAwMAAAAAA//8aHXkZBcMBfIH2FkcXFo6CUUA6eMPAwGA32nAZBUMGMDAwAAAAAP//Gm28jILhAv4yMDCkMTAwlI3G6CgYBUSDm9AzlE6OBtkoGDKAgYEBAAAA//8anTYaBcMRgC50XMnAwMA+GrujYBTgBEegi94/jgbRKBhSgIGBAQAAAP//Gh15GQXDEWyErn95Nxq7o2AUYAWgW9udRhsuo2BIAgYGBgAAAAD//xptvIyC4QqOQ3ciXRyN4VEwCuDgL3RqFbQ49/dosIyCIQkYGBgAAAAA//8anTYaBSMBLGdgYIgYjelRMMLBB+gBjwdGekCMgiEOGBgYAAAAAP//Gm28jIKRAkoZGBi8R2N7FIxQ8BN6R9GD0QQwCoY8YGBgAAAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//GsWjYBSMglEwCkbBKBg6gIGBAQAAAP//AwAh0AHQnX8W1AAAAABJRU5ErkJggg=='

// src/utils/index.tsx
import { Fragment as Fragment6, jsx as jsx14, jsxs as jsxs6 } from 'react/jsx-runtime'
var formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(value)
var formatNumber = (value, maximumSignificantDigits) =>
  new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: maximumSignificantDigits || 6,
  }).format(value)
var formatWei = (value, decimals) => {
  if (value && decimals) return formatNumber(+formatUnits2(BigInt(value), decimals).toString())
  return '--'
}
var rejectedPhrases = [
  'user rejected transaction',
  'User declined to send the transaction',
  'user denied transaction',
  'you must accept',
].map((phrase) => phrase.toLowerCase())
function didUserReject(error) {
  const message = String(
    typeof error === 'string' ? error : error?.message || error?.code || error?.errorMessage || '',
  ).toLowerCase()
  return (
    [4001 /* USER_REJECTED_REQUEST */, 'ACTION_REJECTED' /* ACTION_REJECTED */, -32050 /* ALPHA_WALLET_REJECTED_CODE */]
      .map(String)
      .includes(error?.code?.toString?.()) ||
    [
      4001 /* USER_REJECTED_REQUEST */,
      'Request rejected' /* ALPHA_WALLET_REJECTED */,
      'Error: User closed modal' /* WALLETCONNECT_MODAL_CLOSED */,
      'The transaction was cancelled' /* WALLETCONNECT_CANCELED */,
      'Error: User closed modal' /* WALLETCONNECT_MODAL_CLOSED */,
    ]
      .map(String)
      .includes(message) ||
    rejectedPhrases.some((phrase) => message?.includes?.(phrase))
  )
}
function capitalizeFirstLetter(str) {
  const string = str || ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
function parseKnownPattern(text) {
  const error = text?.toLowerCase?.() || ''
  if (!error || error.includes('router: expired')) return 'An error occurred. Refresh the page and try again '
  if (
    error.includes('mintotalamountout') ||
    error.includes('err_limit_out') ||
    error.includes('return amount is not enough') ||
    error.includes('code=call_exception') ||
    error.includes('none of the calls threw an error')
  )
    return `An error occurred. Try refreshing the price rate or increase max slippage`
  if (error.includes('header not found') || error.includes('swap failed'))
    return `An error occurred. Refresh the page and try again. If the issue still persists, it might be an issue with your RPC node settings in Metamask.`
  if (didUserReject(error)) return `User rejected the transaction.`
  if (error.includes('insufficient')) return `An error occurred. Please try increasing max slippage`
  if (error.includes('permit')) return `An error occurred. Invalid Permit Signature`
  if (error.includes('burn amount exceeds balance'))
    return `Insufficient fee rewards amount, try to remove your liquidity without claiming fees for now and you can try to claim it later`
  if (error === '[object Object]') return `Something went wrong. Please try again`
  return void 0
}
var patterns = [
  {
    pattern: /{"originalError":.+"message":"execution reverted: ([^"]+)"/,
    getMessage: (match) => match[1],
  },
  { pattern: /^([\w ]*\w+) \(.+?\)$/, getMessage: (match) => match[1] },
  { pattern: /"message": ?"[^"]+?"/, getMessage: (match) => match[1] },
]
function parseKnownRegexPattern(text) {
  const pattern = patterns.find((pattern2) => pattern2.pattern.exec(text))
  if (pattern) return capitalizeFirstLetter(pattern.getMessage(pattern.pattern.exec(text)))
  return void 0
}
function friendlyError(error) {
  const message = typeof error === 'string' ? error : error.message
  const knownPattern = parseKnownPattern(message)
  if (knownPattern) return knownPattern
  if (message.length < 100) return message
  const knownRegexPattern = parseKnownRegexPattern(message)
  if (knownRegexPattern) return knownRegexPattern
  return `An error occurred`
}
var getDexName = () => {
  return '9mm V3'
}
var getDexLogo = () => {
  return mm_default
}
var getPriceImpact = (pi, type, zapFeeInfo) => {
  if (pi === null || pi === void 0 || isNaN(pi))
    return {
      msg: `Unable to calculate ${type} impact`,
      level: 'INVALID' /* INVALID */,
      display: '--',
    }
  const piDisplay = pi < 0.01 ? '<0.01%' : pi.toFixed(2) + '%'
  const warningThreshold = zapFeeInfo ? getWarningThreshold(zapFeeInfo) : 1
  if (pi > 10 * warningThreshold) {
    return {
      msg: /* @__PURE__ */ jsxs6('div', {
        children: [
          type,
          ' impact is ',
          /* @__PURE__ */ jsx14('span', { className: 'text-error', children: 'very high' }),
          '. You will lose funds!',
        ],
      }),
      level: 'VERY_HIGH' /* VERY_HIGH */,
      display: piDisplay,
    }
  }
  if (pi > warningThreshold) {
    return {
      msg: /* @__PURE__ */ jsxs6(Fragment6, {
        children: [type, ' impact is ', /* @__PURE__ */ jsx14('span', { className: 'text-warning', children: 'high' })],
      }),
      level: 'HIGH' /* HIGH */,
      display: piDisplay,
    }
  }
  return {
    msg: '',
    level: 'NORMAL' /* NORMAL */,
    display: piDisplay,
  }
}
var feeConfig = {
  ['stable' /* Stable */]: 10,
  ['correlated' /* Correlated */]: 25,
  ['common' /* Common */]: 100,
  ['exotic' /* Exotic */]: 250,
}
var getWarningThreshold = (zapFee) => {
  if (zapFee.protocolFee.pcm <= feeConfig['stable' /* Stable */]) return 0.1
  if (zapFee.protocolFee.pcm <= feeConfig['correlated' /* Correlated */]) return 0.25
  return 1
}
function calculateGasMargin(value) {
  const defaultGasLimitMargin = BigInt(2e4)
  const gasMargin = (value * BigInt(2e3)) / BigInt(1e4)
  return gasMargin >= defaultGasLimitMargin ? value + gasMargin : value + defaultGasLimitMargin
}

// src/hooks/useApprovals.ts
function useApprovals(amounts, addresses, spender) {
  const { account, publicClient, walletClient } = useWeb3Provider()
  const [loading, setLoading] = useState12(false)
  const [approvalStates, setApprovalStates] = useState12(() =>
    addresses.reduce((acc, token) => {
      return {
        ...acc,
        [token]: token === NATIVE_TOKEN_ADDRESS ? 'approved' /* APPROVED */ : 'unknown' /* UNKNOWN */,
      }
    }, {}),
  )
  const [pendingTx, setPendingTx] = useState12('')
  const [addressToApprove, setAddressToApprove] = useState12('')
  const approve = useCallback7(
    async (address) => {
      if (!publicClient || !account || !walletClient) {
        return
      }
      setAddressToApprove(address)
      try {
        const estimatedGas = await publicClient.estimateContractGas({
          account,
          address,
          abi: erc20Abi2,
          functionName: 'approve',
          args: [spender, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')],
        })
        const hash = await walletClient.writeContract({
          account,
          address,
          abi: erc20Abi2,
          functionName: 'approve',
          args: [spender, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')],
          gas: calculateGasMargin(estimatedGas),
          chain: void 0,
        })
        setApprovalStates({
          ...approvalStates,
          [address]: 'pending' /* PENDING */,
        })
        setPendingTx(hash)
      } catch (e) {
        setAddressToApprove('')
        console.log({
          error: e,
        })
      }
    },
    [account, approvalStates, publicClient, spender, walletClient],
  )
  useEffect11(() => {
    if (pendingTx) {
      publicClient
        ?.waitForTransactionReceipt({
          hash: pendingTx,
        })
        .then((receipt) => {
          if (receipt) {
            setPendingTx('')
            setAddressToApprove('')
            setApprovalStates({
              ...approvalStates,
              [addressToApprove]: 'approved' /* APPROVED */,
            })
          }
        })
    }
  }, [pendingTx, addressToApprove, approvalStates, publicClient])
  useEffect11(() => {
    if (!account || !publicClient || !spender || addresses.length !== amounts.length) return
    setLoading(true)
    Promise.all(
      addresses.map((address, index) => {
        if (address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) return 'approved' /* APPROVED */
        return publicClient
          ?.readContract({
            abi: erc20Abi2,
            address,
            functionName: 'allowance',
            args: [account, spender],
          })
          .then((res) => {
            const amountToApproveString = amounts[index]
            const amountToApprove = BigInt(amountToApproveString)
            if (amountToApprove <= res) return 'approved' /* APPROVED */
            else return 'not_approved' /* NOT_APPROVED */
          })
          .catch((e) => {
            console.log('get allowance failed', e)
            return 'unknown' /* UNKNOWN */
          })
      }),
    )
      .then((res) => {
        const tmp = addresses.reduce((acc, address, index) => {
          return {
            ...acc,
            [address]: res[index],
          }
        }, {})
        setApprovalStates(tmp)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [
    account,
    spender,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(addresses),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(amounts),
    publicClient,
  ])
  return { approvalStates, addressToApprove, approve, loading }
}

// src/assets/switch.svg
import * as React4 from 'react'
import { jsx as jsx15 } from 'react/jsx-runtime'
var SvgSwitch = (props) =>
  /* @__PURE__ */ jsx15('svg', {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: /* @__PURE__ */ jsx15('path', {
      d: 'M4.66 7.33337L2 10L4.66 12.6667V10.6667H9.33333V9.33337H4.66V7.33337ZM14 6.00004L11.34 3.33337V5.33337H6.66667V6.66671H11.34V8.66671L14 6.00004Z',
      fill: 'currentColor',
    }),
  })
var switch_default = SvgSwitch

// src/components/Content/PriceInfo.tsx
import { Fragment as Fragment7, jsx as jsx16, jsxs as jsxs7 } from 'react/jsx-runtime'
function PriceInfo() {
  const { loading, pool } = useWidgetInfo()
  const { marketPrice, revertPrice, toggleRevertPrice } = useZapState()
  if (loading) return /* @__PURE__ */ jsx16('div', { className: 'text-textSecondary', children: 'Loading...' })
  const price = pool ? (revertPrice ? pool.priceOf(pool.token1) : pool.priceOf(pool.token0)).toSignificant(6) : '--'
  const isDevatied =
    !!marketPrice && pool && Math.abs(marketPrice / +pool?.priceOf(pool.token0).toSignificant() - 1) > 0.02
  const marketRate = marketPrice ? formatNumber(revertPrice ? 1 / marketPrice : marketPrice) : null
  return /* @__PURE__ */ jsxs7(Fragment7, {
    children: [
      /* @__PURE__ */ jsx16('div', {
        className: 'text-textSecondary',
        children: /* @__PURE__ */ jsxs7('div', {
          className: 'flex items-center gap-1 text-subText text-sm',
          children: [
            /* @__PURE__ */ jsx16('span', { children: 'Pool price' }),
            /* @__PURE__ */ jsx16('span', { className: 'font-medium text-textPrimary', children: price }),
            /* @__PURE__ */ jsx16('span', {
              children: revertPrice
                ? `${pool?.token0.symbol} per ${pool?.token1.symbol}`
                : `${pool?.token1.symbol} per ${pool?.token0.symbol}`,
            }),
            /* @__PURE__ */ jsx16(switch_default, {
              className: 'cursor-pointer',
              onClick: () => toggleRevertPrice(),
              role: 'button',
            }),
          ],
        }),
      }),
      marketPrice === null &&
        /* @__PURE__ */ jsx16('div', {
          className: 'ks-lw-card-warning mt-4',
          children: 'Unable to get the market price. Please be cautious!',
        }),
      isDevatied &&
        /* @__PURE__ */ jsxs7('div', {
          className: 'ks-lw-card-warning mt-4',
          children: [
            /* @__PURE__ */ jsx16('div', {
              className: 'text-warning font-semibold',
              children: 'Pool price discrepancy:',
            }),
            /* @__PURE__ */ jsxs7('div', {
              className: 'text mt-1 leading-5',
              children: [
                'Market price',
                ' ',
                /* @__PURE__ */ jsxs7('span', {
                  className: 'text-warning font-semibold not-italic',
                  children: [marketRate, ' '],
                }),
                revertPrice ? pool?.token0.symbol : pool?.token1.symbol,
                ' per',
                ' ',
                revertPrice ? pool?.token1.symbol : pool?.token0.symbol,
                '. Please consider the risks of impermanent loss before adding liquidity.',
              ],
            }),
          ],
        }),
    ],
  })
}

// src/components/Content/PriceInput.tsx
import { useEffect as useEffect12, useMemo as useMemo4, useState as useState13 } from 'react'
import { nearestUsableTick as nearestUsableTick3 } from '@pancakeswap/v3-sdk'

// src/utils/pancakev3.ts
import { Price } from '@pancakeswap/swap-sdk-core'
import {
  encodeSqrtRatioX96,
  nearestUsableTick as nearestUsableTick2,
  priceToClosestTick,
  TICK_SPACINGS as TICK_SPACINGS2,
  TickMath as TickMath2,
} from '@pancakeswap/v3-sdk'
function tryParsePrice(baseToken, quoteToken, value) {
  if (!baseToken || !quoteToken || !value) {
    return void 0
  }
  if (!value.match(/^\d*\.?\d+$/)) {
    return void 0
  }
  const [whole, fraction] = value.split('.')
  const decimals = fraction?.length ?? 0
  const withoutDecimals = BigInt((whole ?? '') + (fraction ?? ''))
  return new Price(
    baseToken,
    quoteToken,
    BigInt(10 ** decimals) * BigInt(10 ** baseToken.decimals),
    withoutDecimals * BigInt(10 ** quoteToken.decimals),
  )
}
function tryParseTick(baseToken, quoteToken, feeAmount, value) {
  if (!baseToken || !quoteToken || !feeAmount || !value) {
    return null
  }
  const price = tryParsePrice(baseToken, quoteToken, value)
  if (!price) {
    return null
  }
  let tick
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)
  if (sqrtRatioX96 >= TickMath2.MAX_SQRT_RATIO) {
    tick = TickMath2.MAX_TICK
  } else if (sqrtRatioX96 <= TickMath2.MIN_SQRT_RATIO) {
    tick = TickMath2.MIN_TICK
  } else {
    tick = priceToClosestTick(price)
  }
  return nearestUsableTick2(tick, TICK_SPACINGS2[feeAmount])
}

// src/components/Content/PriceInput.tsx
import { jsx as jsx17, jsxs as jsxs8 } from 'react/jsx-runtime'
function PriceInput({ type }) {
  const { tickLower, tickUpper, revertPrice, setTick, priceLower, priceUpper, positionId } = useZapState()
  const { pool } = useWidgetInfo()
  const [localValue, setLocalValue] = useState13('')
  const price = useMemo4(() => {
    const leftPrice = !revertPrice ? priceLower : priceUpper?.invert()
    const rightPrice = !revertPrice ? priceUpper : priceLower?.invert()
    return type === 'PriceLower' /* PriceLower */ ? leftPrice : rightPrice
  }, [type, priceLower, revertPrice, priceUpper])
  const isFullRange = !!pool && tickLower === pool.minTick && tickUpper === pool.maxTick
  const increase = (tick) => {
    if (!pool) return
    const newTick =
      tick === null
        ? nearestUsableTick3(pool.tickCurrent + pool.tickSpacing, pool.tickSpacing)
        : tick + pool.tickSpacing
    setTick(type, newTick)
  }
  const decrease = (tick) => {
    if (!pool) return
    const newTick =
      tick === null
        ? nearestUsableTick3(pool.tickCurrent - pool.tickSpacing, pool.tickSpacing)
        : tick - pool.tickSpacing
    setTick(type, newTick)
  }
  const increaseTick = () => {
    if (type === 'PriceLower' /* PriceLower */) {
      if (!revertPrice) increase(tickLower)
      else decrease(tickUpper)
    } else {
      if (!revertPrice) increase(tickUpper)
      else decrease(tickLower)
    }
  }
  const decreaseTick = () => {
    if (type === 'PriceLower' /* PriceLower */) {
      if (!revertPrice) decrease(tickLower)
      else increase(tickUpper)
    } else {
      if (!revertPrice) decrease(tickUpper)
      else increase(tickLower)
    }
  }
  const correctPrice = (value) => {
    if (!pool) return
    if (revertPrice) {
      const defaultTick = (type === 'PriceLower' /* PriceLower */ ? tickLower : tickUpper) || pool?.tickCurrent
      const tick = tryParseTick(pool?.token1, pool?.token0, pool?.fee, value) ?? defaultTick
      if (Number.isInteger(tick)) setTick(type, nearestUsableTick3(tick, pool.tickSpacing))
    } else {
      const defaultTick = (type === 'PriceLower' /* PriceLower */ ? tickLower : tickUpper) || pool?.tickCurrent
      const tick = tryParseTick(pool?.token0, pool?.token1, pool?.fee, value) ?? defaultTick
      if (Number.isInteger(tick)) setTick(type, nearestUsableTick3(tick, pool.tickSpacing))
    }
  }
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/,/g, '.')
    const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
    if (value === '' || inputRegex.test(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      setLocalValue(value)
    }
  }
  useEffect12(() => {
    if (
      type === 'PriceLower' /* PriceLower */ &&
      (!revertPrice ? pool?.minTick === tickLower : pool?.maxTick === tickUpper)
    ) {
      setLocalValue('0')
    } else if (
      type === 'PriceUpper' /* PriceUpper */ &&
      (!revertPrice ? pool?.maxTick === tickUpper : pool?.minTick === tickLower)
    ) {
      setLocalValue('\u221E')
    } else if (price) setLocalValue(price?.toSignificant(6))
  }, [isFullRange, pool, type, tickLower, tickUpper, price, revertPrice])
  return /* @__PURE__ */ jsxs8('div', {
    className: 'mt-3 p-3 border border-inputBorder text-center rounded-md bg-inputBackground text-textSecondary',
    children: [
      /* @__PURE__ */ jsxs8('span', {
        className: 'text-secondary text-xs font-semibold',
        children: [type === 'PriceLower' /* PriceLower */ ? 'MIN' : 'MAX', ' PRICE'],
      }),
      /* @__PURE__ */ jsxs8('div', {
        className: 'flex my-2 mx-0 gap-1 flex-1 text-sm justify-center',
        children: [
          positionId === void 0 &&
            /* @__PURE__ */ jsx17('button', {
              className:
                'w-6 h-6 rounded-[50%] border-2 border-primary p-0 bg-transparent text-primary text-xl leading-6 cursor-pointer hover:enabled:brightness-150 active:enabled:scale-96 disabled:cursor-not-allowed disabled:opacity-60',
              role: 'button',
              onClick: decreaseTick,
              disabled: isFullRange || positionId !== void 0,
              children: /* @__PURE__ */ jsx17('span', { className: 'relative top-[-3px]', children: '-' }),
            }),
          /* @__PURE__ */ jsx17('input', {
            value: localValue,
            onChange: handleInputChange,
            onBlur: (e) => correctPrice(e.target.value),
            inputMode: 'decimal',
            autoComplete: 'off',
            autoCorrect: 'off',
            disabled: positionId !== void 0,
            type: 'text',
            pattern: '^[0-9]*[.,]?[0-9]*$',
            placeholder: '0.0',
            minLength: 1,
            maxLength: 79,
            spellCheck: 'false',
            className: cn(
              'bg-transparent text-textPrimary text-center text-base w-full max-w-[72px] font-semibold p-0 border-none outline-none disabled:cursor-not-allowed',
              positionId ? 'max-w-[120px]' : '',
            ),
          }),
          positionId === void 0 &&
            /* @__PURE__ */ jsx17('button', {
              className:
                'w-6 h-6 rounded-[50%] border-2 border-primary p-0 bg-transparent text-primary text-xl leading-6 cursor-pointer hover:enabled:brightness-150 active:enabled:scale-96 disabled:cursor-not-allowed disabled:opacity-60',
              onClick: increaseTick,
              disabled: isFullRange || positionId !== void 0,
              children: /* @__PURE__ */ jsx17('span', { className: 'relative top-[-3px]', children: '+' }),
            }),
        ],
      }),
      /* @__PURE__ */ jsx17('div', {
        children: revertPrice
          ? `${pool?.token0.symbol} per ${pool?.token1.symbol}`
          : `${pool?.token1.symbol} per ${pool?.token0.symbol}`,
      }),
    ],
  })
}

// src/components/Content/LiquidityToAdd.tsx
import { useMemo as useMemo5 } from 'react'
import { formatUnits as formatUnits3 } from 'viem'

// src/assets/question.svg?url
var question_default =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="%23fff"%0A    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%0A    class="CurrencyLogo__StyledLogo-sc-1q82rua-1 gpxlKa">%0A    <circle cx="12" cy="12" r="10"></circle>%0A    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>%0A    <line x1="12" y1="17" x2="12.01" y2="17"></line>%0A</svg>'

// src/components/Content/LiquidityToAdd.tsx
import { jsx as jsx18, jsxs as jsxs9 } from 'react/jsx-runtime'
function LiquidityToAdd({ tokenIndex }) {
  const { tokensIn, amountsIn } = useZapState()
  const { onRemoveToken, onAmountChange } = useWidgetInfo()
  const { chainId } = useWeb3Provider()
  const amountIn = useMemo5(() => amountsIn.split(',')[tokenIndex], [amountsIn, tokenIndex])
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/,/g, '.')
    if (value === '.') return
    const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
    if (value === '' || inputRegex.test(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) onChangeTokenAmount(value)
  }
  const onChangeTokenAmount = (newAmount) => {
    onAmountChange(tokensIn[tokenIndex].address, newAmount.toString())
  }
  const handleRemoveToken = () => {
    if (tokensIn.length === 1) return
    onRemoveToken(tokensIn[tokenIndex].address)
  }
  return /* @__PURE__ */ jsxs9('div', {
    children: [
      /* @__PURE__ */ jsxs9('div', {
        className: 'flex justify-between items-center mt-2',
        children: [
          /* @__PURE__ */ jsxs9('div', {
            className: 'ml-1 flex items-center gap-2',
            children: [
              /* @__PURE__ */ jsxs9('div', {
                className: 'relative',
                children: [
                  /* @__PURE__ */ jsx18('img', {
                    className: 'w-6 h-6 rounded-[50%]',
                    src: tokensIn[tokenIndex].logoURI,
                    alt: '',
                    onError: ({ currentTarget }) => {
                      currentTarget.onerror = null
                      currentTarget.src = question_default
                    },
                  }),
                  /* @__PURE__ */ jsx18('div', {
                    className:
                      'absolute w-3 h-3 bg-[#1e1e1e] rounded-[5px] flex items-center justify-center bottom-0 right-0',
                    children: /* @__PURE__ */ jsx18('img', {
                      className: 'rounded-[50%] w-2 h-2',
                      src: NetworkInfo[chainId].logo,
                      onError: ({ currentTarget }) => {
                        currentTarget.onerror = null
                        currentTarget.src = question_default
                      },
                    }),
                  }),
                ],
              }),
              /* @__PURE__ */ jsx18('p', { className: 'font-semibold', children: tokensIn[tokenIndex].symbol }),
              tokensIn.length > 1 &&
                /* @__PURE__ */ jsx18(x_default, {
                  className: 'w-4 h-4 text-textSecondary hover:text-white cursor-pointer',
                  onClick: handleRemoveToken,
                }),
            ],
          }),
          /* @__PURE__ */ jsxs9('div', {
            className: 'text-textSecondary text-xs',
            children: [
              /* @__PURE__ */ jsx18('span', { children: 'Balance' }),
              ':',
              ' ',
              formatWei(tokensIn[tokenIndex].balance?.toString() || '0', tokensIn[tokenIndex].decimals),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxs9('div', {
        className: 'mt-2 border border-inputBorder bg-inputBackground rounded-md py-2 px-4 flex flex-col items-end',
        style: { boxShadow: 'box-shadow: 0px 2px 0px -1px #0000000f inset' },
        children: [
          /* @__PURE__ */ jsx18('input', {
            className:
              'bg-transparent text-textPrimary text-base font-medium w-full p-0 text-right border-none outline-none',
            value: amountIn,
            onChange: handleInputChange,
            inputMode: 'decimal',
            autoComplete: 'off',
            autoCorrect: 'off',
            type: 'text',
            pattern: '^[0-9]*[.,]?[0-9]*$',
            placeholder: '0.0',
            minLength: 1,
            maxLength: 79,
            spellCheck: 'false',
          }),
          /* @__PURE__ */ jsxs9('div', {
            className: 'mt-1 text-sm text-textSecondary',
            children: ['~', formatCurrency(+((tokensIn[tokenIndex].price || 0) * parseFloat(amountIn || '0') || 0))],
          }),
          /* @__PURE__ */ jsxs9('div', {
            className: 'flex justify-end gap-1 text-subText text-sm font-medium mt-1',
            children: [
              /* @__PURE__ */ jsx18('button', {
                className: 'ks-outline-btn small',
                onClick: () => {
                  onChangeTokenAmount(
                    formatUnits3(BigInt(tokensIn[tokenIndex].balance || 0) / BigInt(4), tokensIn[tokenIndex].decimals),
                  )
                },
                children: '25%',
              }),
              /* @__PURE__ */ jsx18('button', {
                className: 'ks-outline-btn small',
                onClick: () => {
                  onChangeTokenAmount(
                    formatUnits3(BigInt(tokensIn[tokenIndex].balance || 0) / BigInt(2), tokensIn[tokenIndex].decimals),
                  )
                },
                children: '50%',
              }),
              /* @__PURE__ */ jsx18('button', {
                className: 'ks-outline-btn small',
                onClick: () => {
                  onChangeTokenAmount(
                    formatUnits3(
                      (BigInt(tokensIn[tokenIndex].balance || 0) * BigInt(3)) / BigInt(4),
                      tokensIn[tokenIndex].decimals,
                    ),
                  )
                },
                children: '75%',
              }),
              /* @__PURE__ */ jsx18('button', {
                className: 'ks-outline-btn small',
                onClick: () => {
                  onChangeTokenAmount(
                    formatUnits3(BigInt(tokensIn[tokenIndex].balance || 0), tokensIn[tokenIndex].decimals),
                  )
                },
                children: 'Max',
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

// src/components/Content/ZapRoute.tsx
import { useMemo as useMemo6 } from 'react'

// src/components/InfoHelper.tsx
import { useCallback as useCallback8, useState as useState14 } from 'react'

// src/assets/info.svg
import * as React5 from 'react'
import { jsx as jsx19, jsxs as jsxs10 } from 'react/jsx-runtime'
var SvgInfo = (props) =>
  /* @__PURE__ */ jsxs10('svg', {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: [
      /* @__PURE__ */ jsxs10('g', {
        clipPath: 'url(#clip0_277_44496)',
        children: [
          /* @__PURE__ */ jsx19('path', {
            d: 'M9.99984 18.3332C14.6022 18.3332 18.3332 14.6022 18.3332 9.99984C18.3332 5.39746 14.6022 1.6665 9.99984 1.6665C5.39746 1.6665 1.6665 5.39746 1.6665 9.99984C1.6665 14.6022 5.39746 18.3332 9.99984 18.3332Z',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }),
          /* @__PURE__ */ jsx19('path', {
            d: 'M10 13.3333V10',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }),
          /* @__PURE__ */ jsx19('path', {
            d: 'M10 6.6665H10.0083',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }),
        ],
      }),
      /* @__PURE__ */ jsx19('defs', {
        children: /* @__PURE__ */ jsx19('clipPath', {
          id: 'clip0_277_44496',
          children: /* @__PURE__ */ jsx19('rect', { width: 20, height: 20, fill: 'currentColor' }),
        }),
      }),
    ],
  })
var info_default = SvgInfo

// src/components/InfoHelper.tsx
import { jsx as jsx20 } from 'react/jsx-runtime'
function InfoHelper({ text, size = 14, placement, style = {}, color, width }) {
  const [show, setShow] = useState14(false)
  const open = useCallback8(() => setShow(true), [setShow])
  const close = useCallback8(() => setShow(false), [setShow])
  return /* @__PURE__ */ jsx20('span', {
    style: {
      display: 'inline-flex',
      justifyContent: 'center',
      marginLeft: '0.25rem',
      alignItems: 'center',
      lineHeight: '100%',
      verticalAlign: 'middle',
      ...style,
    },
    children: /* @__PURE__ */ jsx20(Tooltip, {
      text,
      show,
      placement,
      size,
      width,
      children: /* @__PURE__ */ jsx20('div', {
        onClick: open,
        onMouseEnter: open,
        onMouseLeave: close,
        className:
          'flex items-center justify-center border-none bg-transparent outline-none cursor-default rounded-[36px] text-textSecondary',
        children: /* @__PURE__ */ jsx20(info_default, { style: { color, width: size, height: size } }),
      }),
    }),
  })
}

// src/components/Content/ZapRoute.tsx
import { Fragment as Fragment8, jsx as jsx21, jsxs as jsxs11 } from 'react/jsx-runtime'
function ZapRoute() {
  const { zapInfo, tokensIn } = useZapState()
  const { pool } = useWidgetInfo()
  const { chainId } = useWeb3Provider()
  const tokens = useMemo6(
    () => [...tokensIn, pool?.token0, pool?.token1, NetworkInfo[chainId].wrappedToken],
    [chainId, pool?.token0, pool?.token1, tokensIn],
  )
  const swapInfo = useMemo6(() => {
    const aggregatorSwapInfo = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP' /* AGGREGATOR_SWAP */,
    )
    const poolSwapInfo = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_POOL_SWAP' /* POOL_SWAP */,
    )
    const parsedAggregatorSwapInfo =
      aggregatorSwapInfo?.aggregatorSwap?.swaps?.map((item) => {
        const tokenIn = tokens.find((token) => token.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find((token) => token.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn: formatWei(item.tokenIn.amount, tokenIn?.decimals),
          amountOut: formatWei(item.tokenOut.amount, tokenOut?.decimals),
          pool: 'KyberSwap',
        }
      }) || []
    const parsedPoolSwapInfo =
      poolSwapInfo?.poolSwap?.swaps?.map((item) => {
        const tokenIn = tokens.find((token) => token.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find((token) => token.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn: formatWei(item.tokenIn.amount, tokenIn?.decimals),
          amountOut: formatWei(item.tokenOut.amount, tokenOut?.decimals),
          pool: `${getDexName()} Pool`,
        }
      }) || []
    return parsedAggregatorSwapInfo.concat(parsedPoolSwapInfo)
  }, [tokens, zapInfo?.zapDetails.actions])
  const addedLiquidityInfo = useMemo6(() => {
    const data = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_ADD_LIQUIDITY' /* ADD_LIQUIDITY */,
    )
    const addedAmount0 = formatWei(data?.addLiquidity.token0.amount, pool?.token0.decimals)
    const addedAmount1 = formatWei(data?.addLiquidity.token1.amount, pool?.token1.decimals)
    return { addedAmount0, addedAmount1 }
  }, [pool?.token0.decimals, pool?.token1.decimals, zapInfo?.zapDetails.actions])
  return /* @__PURE__ */ jsxs11(Fragment8, {
    children: [
      /* @__PURE__ */ jsxs11('div', {
        className: 'text-xs font-medium text-secondary uppercase',
        children: [
          'Zap Route',
          /* @__PURE__ */ jsx21(InfoHelper, { text: 'The actual Zap Route could be adjusted with on-chain states' }),
        ],
      }),
      /* @__PURE__ */ jsxs11('div', {
        className: 'ks-lw-card flex flex-col gap-4',
        children: [
          swapInfo.map((item, index) =>
            /* @__PURE__ */ jsxs11(
              'div',
              {
                className: 'flex gap-3 items-center',
                children: [
                  /* @__PURE__ */ jsx21('div', {
                    className:
                      'rounded-[50%] w-6 h-6 flex justify-center items-center text-sm font-medium bg-inputBackground text-textSecondary',
                    children: index + 1,
                  }),
                  /* @__PURE__ */ jsxs11('div', {
                    className: 'flex-1 text-xs text-textSecondary leading-[18px]',
                    children: [
                      'Swap ',
                      item.amountIn,
                      ' ',
                      item.tokenInSymbol,
                      ' for ',
                      item.amountOut,
                      ' ',
                      item.tokenOutSymbol,
                      ' via',
                      ' ',
                      /* @__PURE__ */ jsx21('span', { className: 'text-textPrimary font-medium', children: item.pool }),
                    ],
                  }),
                ],
              },
              index,
            ),
          ),
          /* @__PURE__ */ jsxs11('div', {
            className: 'flex gap-3 items-center',
            children: [
              /* @__PURE__ */ jsx21('div', {
                className:
                  'rounded-[50%] w-6 h-6 flex justify-center items-center text-sm font-medium bg-inputBackground text-textSecondary',
                children: swapInfo.length + 1,
              }),
              /* @__PURE__ */ jsxs11('div', {
                className: 'flex-1 text-xs text-textSecondary leading-[18px]',
                children: [
                  'Build LP using ',
                  addedLiquidityInfo.addedAmount0,
                  ' ',
                  pool?.token0.symbol,
                  ' and ',
                  addedLiquidityInfo.addedAmount1,
                  ' ',
                  pool?.token1.symbol,
                  ' on',
                  ' ',
                  /* @__PURE__ */ jsx21('span', { className: 'text-textPrimary font-medium', children: getDexName() }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

// src/components/Content/EstLiqValue.tsx
import { formatUnits as formatUnits4 } from 'viem'

// ../ui/src/components/ui/accordion.tsx
import * as React21 from 'react'

// ../../node_modules/.pnpm/@radix-ui+react-accordion@1.2.1_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-accordion/dist/index.mjs
import React19 from 'react'

// ../../node_modules/.pnpm/@radix-ui+react-context@1.1.1_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-context/dist/index.mjs
import * as React6 from 'react'
import { jsx as jsx22 } from 'react/jsx-runtime'
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = []
  function createContext32(rootComponentName, defaultContext) {
    const BaseContext = React6.createContext(defaultContext)
    const index = defaultContexts.length
    defaultContexts = [...defaultContexts, defaultContext]
    const Provider = (props) => {
      const { scope, children, ...context } = props
      const Context = scope?.[scopeName]?.[index] || BaseContext
      const value = React6.useMemo(() => context, Object.values(context))
      return /* @__PURE__ */ jsx22(Context.Provider, { value, children })
    }
    Provider.displayName = rootComponentName + 'Provider'
    function useContext22(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext
      const context = React6.useContext(Context)
      if (context) return context
      if (defaultContext !== void 0) return defaultContext
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
    }
    return [Provider, useContext22]
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React6.createContext(defaultContext)
    })
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts
      return React6.useMemo(() => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }), [scope, contexts])
    }
  }
  createScope.scopeName = scopeName
  return [createContext32, composeContextScopes(createScope, ...createContextScopeDeps)]
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0]
  if (scopes.length === 1) return baseScope
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName,
    }))
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes)
        const currentScope = scopeProps[`__scope${scopeName}`]
        return { ...nextScopes2, ...currentScope }
      }, {})
      return React6.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes])
    }
  }
  createScope.scopeName = baseScope.scopeName
  return createScope
}

// ../../node_modules/.pnpm/@radix-ui+react-collection@1.1.0_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-collection/dist/index.mjs
import React10 from 'react'

// ../../node_modules/.pnpm/@radix-ui+react-context@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-context/dist/index.mjs
import * as React7 from 'react'
import { jsx as jsx23 } from 'react/jsx-runtime'
function createContextScope2(scopeName, createContextScopeDeps = []) {
  let defaultContexts = []
  function createContext32(rootComponentName, defaultContext) {
    const BaseContext = React7.createContext(defaultContext)
    const index = defaultContexts.length
    defaultContexts = [...defaultContexts, defaultContext]
    function Provider(props) {
      const { scope, children, ...context } = props
      const Context = scope?.[scopeName][index] || BaseContext
      const value = React7.useMemo(() => context, Object.values(context))
      return /* @__PURE__ */ jsx23(Context.Provider, { value, children })
    }
    function useContext22(consumerName, scope) {
      const Context = scope?.[scopeName][index] || BaseContext
      const context = React7.useContext(Context)
      if (context) return context
      if (defaultContext !== void 0) return defaultContext
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
    }
    Provider.displayName = rootComponentName + 'Provider'
    return [Provider, useContext22]
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React7.createContext(defaultContext)
    })
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts
      return React7.useMemo(() => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }), [scope, contexts])
    }
  }
  createScope.scopeName = scopeName
  return [createContext32, composeContextScopes2(createScope, ...createContextScopeDeps)]
}
function composeContextScopes2(...scopes) {
  const baseScope = scopes[0]
  if (scopes.length === 1) return baseScope
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName,
    }))
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes)
        const currentScope = scopeProps[`__scope${scopeName}`]
        return { ...nextScopes2, ...currentScope }
      }, {})
      return React7.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes])
    }
  }
  createScope.scopeName = baseScope.scopeName
  return createScope
}

// ../../node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import * as React8 from 'react'
function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null && ref !== void 0) {
    ref.current = value
  }
}
function composeRefs(...refs) {
  return (node) => refs.forEach((ref) => setRef(ref, node))
}
function useComposedRefs(...refs) {
  return React8.useCallback(composeRefs(...refs), refs)
}

// ../../node_modules/.pnpm/@radix-ui+react-slot@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-slot/dist/index.mjs
import * as React9 from 'react'
import { Fragment as Fragment9, jsx as jsx24 } from 'react/jsx-runtime'
var Slot = React9.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props
  const childrenArray = React9.Children.toArray(children)
  const slottable = childrenArray.find(isSlottable)
  if (slottable) {
    const newElement = slottable.props.children
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (React9.Children.count(newElement) > 1) return React9.Children.only(null)
        return React9.isValidElement(newElement) ? newElement.props.children : null
      } else {
        return child
      }
    })
    return /* @__PURE__ */ jsx24(SlotClone, {
      ...slotProps,
      ref: forwardedRef,
      children: React9.isValidElement(newElement) ? React9.cloneElement(newElement, void 0, newChildren) : null,
    })
  }
  return /* @__PURE__ */ jsx24(SlotClone, { ...slotProps, ref: forwardedRef, children })
})
Slot.displayName = 'Slot'
var SlotClone = React9.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props
  if (React9.isValidElement(children)) {
    const childrenRef = getElementRef(children)
    return React9.cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      // @ts-ignore
      ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
    })
  }
  return React9.Children.count(children) > 1 ? React9.Children.only(null) : null
})
SlotClone.displayName = 'SlotClone'
var Slottable = ({ children }) => {
  return /* @__PURE__ */ jsx24(Fragment9, { children })
}
function isSlottable(child) {
  return React9.isValidElement(child) && child.type === Slottable
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps }
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]
    const isHandler = /^on[A-Z]/.test(propName)
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args)
          slotPropValue(...args)
        }
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue }
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ')
    }
  }
  return { ...slotProps, ...overrideProps }
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return element.ref
  }
  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return element.props.ref
  }
  return element.props.ref || element.ref
}

// ../../node_modules/.pnpm/@radix-ui+react-collection@1.1.0_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-collection/dist/index.mjs
import { jsx as jsx25 } from 'react/jsx-runtime'
function createCollection(name) {
  const PROVIDER_NAME = name + 'CollectionProvider'
  const [createCollectionContext, createCollectionScope2] = createContextScope2(PROVIDER_NAME)
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
    collectionRef: { current: null },
    itemMap: /* @__PURE__ */ new Map(),
  })
  const CollectionProvider = (props) => {
    const { scope, children } = props
    const ref = React10.useRef(null)
    const itemMap = React10.useRef(/* @__PURE__ */ new Map()).current
    return /* @__PURE__ */ jsx25(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children })
  }
  CollectionProvider.displayName = PROVIDER_NAME
  const COLLECTION_SLOT_NAME = name + 'CollectionSlot'
  const CollectionSlot = React10.forwardRef((props, forwardedRef) => {
    const { scope, children } = props
    const context = useCollectionContext(COLLECTION_SLOT_NAME, scope)
    const composedRefs = useComposedRefs(forwardedRef, context.collectionRef)
    return /* @__PURE__ */ jsx25(Slot, { ref: composedRefs, children })
  })
  CollectionSlot.displayName = COLLECTION_SLOT_NAME
  const ITEM_SLOT_NAME = name + 'CollectionItemSlot'
  const ITEM_DATA_ATTR = 'data-radix-collection-item'
  const CollectionItemSlot = React10.forwardRef((props, forwardedRef) => {
    const { scope, children, ...itemData } = props
    const ref = React10.useRef(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const context = useCollectionContext(ITEM_SLOT_NAME, scope)
    React10.useEffect(() => {
      context.itemMap.set(ref, { ref, ...itemData })
      return () => void context.itemMap.delete(ref)
    })
    return /* @__PURE__ */ jsx25(Slot, { ...{ [ITEM_DATA_ATTR]: '' }, ref: composedRefs, children })
  })
  CollectionItemSlot.displayName = ITEM_SLOT_NAME
  function useCollection2(scope) {
    const context = useCollectionContext(name + 'CollectionConsumer', scope)
    const getItems = React10.useCallback(() => {
      const collectionNode = context.collectionRef.current
      if (!collectionNode) return []
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`))
      const items = Array.from(context.itemMap.values())
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current),
      )
      return orderedItems
    }, [context.collectionRef, context.itemMap])
    return getItems
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection2,
    createCollectionScope2,
  ]
}

// ../../node_modules/.pnpm/@radix-ui+primitive@1.1.0/node_modules/@radix-ui/primitive/dist/index.mjs
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler?.(event)
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event)
    }
  }
}

// ../../node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
import * as React12 from 'react'

// ../../node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
import * as React11 from 'react'
function useCallbackRef(callback) {
  const callbackRef = React11.useRef(callback)
  React11.useEffect(() => {
    callbackRef.current = callback
  })
  return React11.useMemo(
    () =>
      (...args) =>
        callbackRef.current?.(...args),
    [],
  )
}

// ../../node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
function useControllableState({ prop, defaultProp, onChange = () => {} }) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({ defaultProp, onChange })
  const isControlled = prop !== void 0
  const value = isControlled ? prop : uncontrolledProp
  const handleChange = useCallbackRef(onChange)
  const setValue = React12.useCallback(
    (nextValue) => {
      if (isControlled) {
        const setter = nextValue
        const value2 = typeof nextValue === 'function' ? setter(prop) : nextValue
        if (value2 !== prop) handleChange(value2)
      } else {
        setUncontrolledProp(nextValue)
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange],
  )
  return [value, setValue]
}
function useUncontrolledState({ defaultProp, onChange }) {
  const uncontrolledState = React12.useState(defaultProp)
  const [value] = uncontrolledState
  const prevValueRef = React12.useRef(value)
  const handleChange = useCallbackRef(onChange)
  React12.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value)
      prevValueRef.current = value
    }
  }, [value, prevValueRef, handleChange])
  return uncontrolledState
}

// ../../node_modules/.pnpm/@radix-ui+react-primitive@2.0.0_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-primitive/dist/index.mjs
import * as React13 from 'react'
import * as ReactDOM2 from 'react-dom'
import { jsx as jsx26 } from 'react/jsx-runtime'
var NODES = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'span',
  'svg',
  'ul',
]
var Primitive = NODES.reduce((primitive, node) => {
  const Node = React13.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props
    const Comp = asChild ? Slot : node
    if (typeof window !== 'undefined') {
      window[Symbol.for('radix-ui')] = true
    }
    return /* @__PURE__ */ jsx26(Comp, { ...primitiveProps, ref: forwardedRef })
  })
  Node.displayName = `Primitive.${node}`
  return { ...primitive, [node]: Node }
}, {})

// ../../node_modules/.pnpm/@radix-ui+react-collapsible@1.1.1_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-collapsible/dist/index.mjs
import * as React17 from 'react'

// ../../node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
import * as React14 from 'react'
var useLayoutEffect2 = Boolean(globalThis?.document) ? React14.useLayoutEffect : () => {}

// ../../node_modules/.pnpm/@radix-ui+react-presence@1.1.1_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-presence/dist/index.mjs
import * as React22 from 'react'
import * as React15 from 'react'
function useStateMachine(initialState, machine) {
  return React15.useReducer((state, event) => {
    const nextState = machine[state][event]
    return nextState ?? state
  }, initialState)
}
var Presence = (props) => {
  const { present, children } = props
  const presence = usePresence(present)
  const child =
    typeof children === 'function' ? children({ present: presence.isPresent }) : React22.Children.only(children)
  const ref = useComposedRefs(presence.ref, getElementRef2(child))
  const forceMount = typeof children === 'function'
  return forceMount || presence.isPresent ? React22.cloneElement(child, { ref }) : null
}
Presence.displayName = 'Presence'
function usePresence(present) {
  const [node, setNode] = React22.useState()
  const stylesRef = React22.useRef({})
  const prevPresentRef = React22.useRef(present)
  const prevAnimationNameRef = React22.useRef('none')
  const initialState = present ? 'mounted' : 'unmounted'
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: 'unmounted',
      ANIMATION_OUT: 'unmountSuspended',
    },
    unmountSuspended: {
      MOUNT: 'mounted',
      ANIMATION_END: 'unmounted',
    },
    unmounted: {
      MOUNT: 'mounted',
    },
  })
  React22.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current)
    prevAnimationNameRef.current = state === 'mounted' ? currentAnimationName : 'none'
  }, [state])
  useLayoutEffect2(() => {
    const styles = stylesRef.current
    const wasPresent = prevPresentRef.current
    const hasPresentChanged = wasPresent !== present
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current
      const currentAnimationName = getAnimationName(styles)
      if (present) {
        send('MOUNT')
      } else if (currentAnimationName === 'none' || styles?.display === 'none') {
        send('UNMOUNT')
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName
        if (wasPresent && isAnimating) {
          send('ANIMATION_OUT')
        } else {
          send('UNMOUNT')
        }
      }
      prevPresentRef.current = present
    }
  }, [present, send])
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId
      const ownerWindow = node.ownerDocument.defaultView ?? window
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current)
        const isCurrentAnimation = currentAnimationName.includes(event.animationName)
        if (event.target === node && isCurrentAnimation) {
          send('ANIMATION_END')
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode
            node.style.animationFillMode = 'forwards'
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === 'forwards') {
                node.style.animationFillMode = currentFillMode
              }
            })
          }
        }
      }
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current)
        }
      }
      node.addEventListener('animationstart', handleAnimationStart)
      node.addEventListener('animationcancel', handleAnimationEnd)
      node.addEventListener('animationend', handleAnimationEnd)
      return () => {
        ownerWindow.clearTimeout(timeoutId)
        node.removeEventListener('animationstart', handleAnimationStart)
        node.removeEventListener('animationcancel', handleAnimationEnd)
        node.removeEventListener('animationend', handleAnimationEnd)
      }
    } else {
      send('ANIMATION_END')
    }
  }, [node, send])
  return {
    isPresent: ['mounted', 'unmountSuspended'].includes(state),
    ref: React22.useCallback((node2) => {
      if (node2) stylesRef.current = getComputedStyle(node2)
      setNode(node2)
    }, []),
  }
}
function getAnimationName(styles) {
  return styles?.animationName || 'none'
}
function getElementRef2(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return element.ref
  }
  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return element.props.ref
  }
  return element.props.ref || element.ref
}

// ../../node_modules/.pnpm/@radix-ui+react-id@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-id/dist/index.mjs
import * as React16 from 'react'
var useReactId = React16['useId'.toString()] || (() => void 0)
var count = 0
function useId(deterministicId) {
  const [id, setId] = React16.useState(useReactId())
  useLayoutEffect2(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++))
  }, [deterministicId])
  return deterministicId || (id ? `radix-${id}` : '')
}

// ../../node_modules/.pnpm/@radix-ui+react-collapsible@1.1.1_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-collapsible/dist/index.mjs
import { jsx as jsx27 } from 'react/jsx-runtime'
var COLLAPSIBLE_NAME = 'Collapsible'
var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME)
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME)
var Collapsible = React17.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, open: openProp, defaultOpen, disabled, onOpenChange, ...collapsibleProps } = props
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })
  return /* @__PURE__ */ jsx27(CollapsibleProvider, {
    scope: __scopeCollapsible,
    disabled,
    contentId: useId(),
    open,
    onOpenToggle: React17.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
    children: /* @__PURE__ */ jsx27(Primitive.div, {
      'data-state': getState(open),
      'data-disabled': disabled ? '' : void 0,
      ...collapsibleProps,
      ref: forwardedRef,
    }),
  })
})
Collapsible.displayName = COLLAPSIBLE_NAME
var TRIGGER_NAME = 'CollapsibleTrigger'
var CollapsibleTrigger = React17.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, ...triggerProps } = props
  const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible)
  return /* @__PURE__ */ jsx27(Primitive.button, {
    type: 'button',
    'aria-controls': context.contentId,
    'aria-expanded': context.open || false,
    'data-state': getState(context.open),
    'data-disabled': context.disabled ? '' : void 0,
    disabled: context.disabled,
    ...triggerProps,
    ref: forwardedRef,
    onClick: composeEventHandlers(props.onClick, context.onOpenToggle),
  })
})
CollapsibleTrigger.displayName = TRIGGER_NAME
var CONTENT_NAME = 'CollapsibleContent'
var CollapsibleContent = React17.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props
  const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible)
  return /* @__PURE__ */ jsx27(Presence, {
    present: forceMount || context.open,
    children: ({ present }) =>
      /* @__PURE__ */ jsx27(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }),
  })
})
CollapsibleContent.displayName = CONTENT_NAME
var CollapsibleContentImpl = React17.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props
  const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible)
  const [isPresent, setIsPresent] = React17.useState(present)
  const ref = React17.useRef(null)
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const heightRef = React17.useRef(0)
  const height = heightRef.current
  const widthRef = React17.useRef(0)
  const width = widthRef.current
  const isOpen = context.open || isPresent
  const isMountAnimationPreventedRef = React17.useRef(isOpen)
  const originalStylesRef = React17.useRef()
  React17.useEffect(() => {
    const rAF = requestAnimationFrame(() => (isMountAnimationPreventedRef.current = false))
    return () => cancelAnimationFrame(rAF)
  }, [])
  useLayoutEffect2(() => {
    const node = ref.current
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName,
      }
      node.style.transitionDuration = '0s'
      node.style.animationName = 'none'
      const rect = node.getBoundingClientRect()
      heightRef.current = rect.height
      widthRef.current = rect.width
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration
        node.style.animationName = originalStylesRef.current.animationName
      }
      setIsPresent(present)
    }
  }, [context.open, present])
  return /* @__PURE__ */ jsx27(Primitive.div, {
    'data-state': getState(context.open),
    'data-disabled': context.disabled ? '' : void 0,
    id: context.contentId,
    hidden: !isOpen,
    ...contentProps,
    ref: composedRefs,
    style: {
      [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
      [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
      ...props.style,
    },
    children: isOpen && children,
  })
})
function getState(open) {
  return open ? 'open' : 'closed'
}
var Root = Collapsible
var Trigger = CollapsibleTrigger
var Content = CollapsibleContent

// ../../node_modules/.pnpm/@radix-ui+react-direction@1.1.0_@types+react@18.3.12_react@18.3.1/node_modules/@radix-ui/react-direction/dist/index.mjs
import * as React18 from 'react'
import { jsx as jsx28 } from 'react/jsx-runtime'
var DirectionContext = React18.createContext(void 0)
function useDirection(localDir) {
  const globalDir = React18.useContext(DirectionContext)
  return localDir || globalDir || 'ltr'
}

// ../../node_modules/.pnpm/@radix-ui+react-accordion@1.2.1_@types+react-dom@18.3.1_@types+react@18.3.12_react-dom@18.3.1_react@18.3.1/node_modules/@radix-ui/react-accordion/dist/index.mjs
import { jsx as jsx29 } from 'react/jsx-runtime'
var ACCORDION_NAME = 'Accordion'
var ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']
var [Collection, useCollection, createCollectionScope] = createCollection(ACCORDION_NAME)
var [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME, [
  createCollectionScope,
  createCollapsibleScope,
])
var useCollapsibleScope = createCollapsibleScope()
var Accordion = React19.forwardRef((props, forwardedRef) => {
  const { type, ...accordionProps } = props
  const singleProps = accordionProps
  const multipleProps = accordionProps
  return /* @__PURE__ */ jsx29(Collection.Provider, {
    scope: props.__scopeAccordion,
    children:
      type === 'multiple'
        ? /* @__PURE__ */ jsx29(AccordionImplMultiple, { ...multipleProps, ref: forwardedRef })
        : /* @__PURE__ */ jsx29(AccordionImplSingle, { ...singleProps, ref: forwardedRef }),
  })
})
Accordion.displayName = ACCORDION_NAME
var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME)
var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(ACCORDION_NAME, {
  collapsible: false,
})
var AccordionImplSingle = React19.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    collapsible = false,
    ...accordionSingleProps
  } = props
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })
  return /* @__PURE__ */ jsx29(AccordionValueProvider, {
    scope: props.__scopeAccordion,
    value: value ? [value] : [],
    onItemOpen: setValue,
    onItemClose: React19.useCallback(() => collapsible && setValue(''), [collapsible, setValue]),
    children: /* @__PURE__ */ jsx29(AccordionCollapsibleProvider, {
      scope: props.__scopeAccordion,
      collapsible,
      children: /* @__PURE__ */ jsx29(AccordionImpl, { ...accordionSingleProps, ref: forwardedRef }),
    }),
  })
})
var AccordionImplMultiple = React19.forwardRef((props, forwardedRef) => {
  const { value: valueProp, defaultValue, onValueChange = () => {}, ...accordionMultipleProps } = props
  const [value = [], setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })
  const handleItemOpen = React19.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue],
  )
  const handleItemClose = React19.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)),
    [setValue],
  )
  return /* @__PURE__ */ jsx29(AccordionValueProvider, {
    scope: props.__scopeAccordion,
    value,
    onItemOpen: handleItemOpen,
    onItemClose: handleItemClose,
    children: /* @__PURE__ */ jsx29(AccordionCollapsibleProvider, {
      scope: props.__scopeAccordion,
      collapsible: true,
      children: /* @__PURE__ */ jsx29(AccordionImpl, { ...accordionMultipleProps, ref: forwardedRef }),
    }),
  })
})
var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME)
var AccordionImpl = React19.forwardRef((props, forwardedRef) => {
  const { __scopeAccordion, disabled, dir, orientation = 'vertical', ...accordionProps } = props
  const accordionRef = React19.useRef(null)
  const composedRefs = useComposedRefs(accordionRef, forwardedRef)
  const getItems = useCollection(__scopeAccordion)
  const direction = useDirection(dir)
  const isDirectionLTR = direction === 'ltr'
  const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
    if (!ACCORDION_KEYS.includes(event.key)) return
    const target = event.target
    const triggerCollection = getItems().filter((item) => !item.ref.current?.disabled)
    const triggerIndex = triggerCollection.findIndex((item) => item.ref.current === target)
    const triggerCount = triggerCollection.length
    if (triggerIndex === -1) return
    event.preventDefault()
    let nextIndex = triggerIndex
    const homeIndex = 0
    const endIndex = triggerCount - 1
    const moveNext = () => {
      nextIndex = triggerIndex + 1
      if (nextIndex > endIndex) {
        nextIndex = homeIndex
      }
    }
    const movePrev = () => {
      nextIndex = triggerIndex - 1
      if (nextIndex < homeIndex) {
        nextIndex = endIndex
      }
    }
    switch (event.key) {
      case 'Home':
        nextIndex = homeIndex
        break
      case 'End':
        nextIndex = endIndex
        break
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          if (isDirectionLTR) {
            moveNext()
          } else {
            movePrev()
          }
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical') {
          moveNext()
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          if (isDirectionLTR) {
            movePrev()
          } else {
            moveNext()
          }
        }
        break
      case 'ArrowUp':
        if (orientation === 'vertical') {
          movePrev()
        }
        break
    }
    const clampedIndex = nextIndex % triggerCount
    triggerCollection[clampedIndex].ref.current?.focus()
  })
  return /* @__PURE__ */ jsx29(AccordionImplProvider, {
    scope: __scopeAccordion,
    disabled,
    direction: dir,
    orientation,
    children: /* @__PURE__ */ jsx29(Collection.Slot, {
      scope: __scopeAccordion,
      children: /* @__PURE__ */ jsx29(Primitive.div, {
        ...accordionProps,
        'data-orientation': orientation,
        ref: composedRefs,
        onKeyDown: disabled ? void 0 : handleKeyDown,
      }),
    }),
  })
})
var ITEM_NAME = 'AccordionItem'
var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME)
var AccordionItem = React19.forwardRef((props, forwardedRef) => {
  const { __scopeAccordion, value, ...accordionItemProps } = props
  const accordionContext = useAccordionContext(ITEM_NAME, __scopeAccordion)
  const valueContext = useAccordionValueContext(ITEM_NAME, __scopeAccordion)
  const collapsibleScope = useCollapsibleScope(__scopeAccordion)
  const triggerId = useId()
  const open = (value && valueContext.value.includes(value)) || false
  const disabled = accordionContext.disabled || props.disabled
  return /* @__PURE__ */ jsx29(AccordionItemProvider, {
    scope: __scopeAccordion,
    open,
    disabled,
    triggerId,
    children: /* @__PURE__ */ jsx29(Root, {
      'data-orientation': accordionContext.orientation,
      'data-state': getState2(open),
      ...collapsibleScope,
      ...accordionItemProps,
      ref: forwardedRef,
      disabled,
      open,
      onOpenChange: (open2) => {
        if (open2) {
          valueContext.onItemOpen(value)
        } else {
          valueContext.onItemClose(value)
        }
      },
    }),
  })
})
AccordionItem.displayName = ITEM_NAME
var HEADER_NAME = 'AccordionHeader'
var AccordionHeader = React19.forwardRef((props, forwardedRef) => {
  const { __scopeAccordion, ...headerProps } = props
  const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion)
  const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion)
  return /* @__PURE__ */ jsx29(Primitive.h3, {
    'data-orientation': accordionContext.orientation,
    'data-state': getState2(itemContext.open),
    'data-disabled': itemContext.disabled ? '' : void 0,
    ...headerProps,
    ref: forwardedRef,
  })
})
AccordionHeader.displayName = HEADER_NAME
var TRIGGER_NAME2 = 'AccordionTrigger'
var AccordionTrigger = React19.forwardRef((props, forwardedRef) => {
  const { __scopeAccordion, ...triggerProps } = props
  const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion)
  const itemContext = useAccordionItemContext(TRIGGER_NAME2, __scopeAccordion)
  const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME2, __scopeAccordion)
  const collapsibleScope = useCollapsibleScope(__scopeAccordion)
  return /* @__PURE__ */ jsx29(Collection.ItemSlot, {
    scope: __scopeAccordion,
    children: /* @__PURE__ */ jsx29(Trigger, {
      'aria-disabled': (itemContext.open && !collapsibleContext.collapsible) || void 0,
      'data-orientation': accordionContext.orientation,
      id: itemContext.triggerId,
      ...collapsibleScope,
      ...triggerProps,
      ref: forwardedRef,
    }),
  })
})
AccordionTrigger.displayName = TRIGGER_NAME2
var CONTENT_NAME2 = 'AccordionContent'
var AccordionContent = React19.forwardRef((props, forwardedRef) => {
  const { __scopeAccordion, ...contentProps } = props
  const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion)
  const itemContext = useAccordionItemContext(CONTENT_NAME2, __scopeAccordion)
  const collapsibleScope = useCollapsibleScope(__scopeAccordion)
  return /* @__PURE__ */ jsx29(Content, {
    role: 'region',
    'aria-labelledby': itemContext.triggerId,
    'data-orientation': accordionContext.orientation,
    ...collapsibleScope,
    ...contentProps,
    ref: forwardedRef,
    style: {
      ['--radix-accordion-content-height']: 'var(--radix-collapsible-content-height)',
      ['--radix-accordion-content-width']: 'var(--radix-collapsible-content-width)',
      ...props.style,
    },
  })
})
AccordionContent.displayName = CONTENT_NAME2
function getState2(open) {
  return open ? 'open' : 'closed'
}
var Root2 = Accordion
var Item = AccordionItem
var Header = AccordionHeader
var Trigger2 = AccordionTrigger
var Content2 = AccordionContent

// ../ui/src/components/icons/chevron-down.svg
import * as React20 from 'react'
import { jsx as jsx30 } from 'react/jsx-runtime'
var SvgChevronDown = (props) =>
  /* @__PURE__ */ jsx30('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'lucide lucide-chevron-down',
    ...props,
    children: /* @__PURE__ */ jsx30('path', { d: 'm6 9 6 6 6-6' }),
  })
var chevron_down_default = SvgChevronDown

// ../ui/src/components/ui/accordion.tsx
import { jsx as jsx31, jsxs as jsxs12 } from 'react/jsx-runtime'
var Accordion2 = Root2
var AccordionItem2 = React21.forwardRef(({ className, ...props }, ref) =>
  /* @__PURE__ */ jsx31(Item, { className: cn('', className), ref, ...props }),
)
AccordionItem2.displayName = 'AccordionItem'
var AccordionTrigger2 = React21.forwardRef(({ className, children, ...props }, ref) =>
  /* @__PURE__ */ jsx31(Header, {
    className: 'flex',
    children: /* @__PURE__ */ jsxs12(Trigger2, {
      className: cn(
        'flex flex-1 items-center justify-between transition-all [&[data-state=open]>svg]:rotate-180 w-full outline-none',
        className,
      ),
      ref,
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx31(chevron_down_default, {
          className: 'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
        }),
      ],
    }),
  }),
)
AccordionTrigger2.displayName = Trigger2.displayName
var AccordionContent2 = React21.forwardRef(({ className, children, ...props }, ref) =>
  /* @__PURE__ */ jsx31(Content2, {
    className:
      'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    ref,
    ...props,
    children: /* @__PURE__ */ jsx31('div', { className: cn('pt-2', className), children }),
  }),
)
AccordionContent2.displayName = Content2.displayName

// src/components/Content/EstLiqValue.tsx
import { useMemo as useMemo10 } from 'react'
import { Fragment as Fragment10, jsx as jsx32, jsxs as jsxs13 } from 'react/jsx-runtime'
function EstLiqValue() {
  const { zapInfo, source, marketPrice, revertPrice, tokensIn } = useZapState()
  const { pool, position, positionOwner, farmContractAddresses, positionId } = useWidgetInfo()
  const { account, chainId } = useWeb3Provider()
  const isOwnByFarmContract =
    positionOwner && farmContractAddresses.some((address) => address.toLowerCase() === positionOwner.toLowerCase())
  const isNotOwnByUser = positionOwner && account && positionOwner.toLowerCase() !== account.toLowerCase()
  const token0 = pool?.token0
  const token1 = pool?.token1
  const tokens = useMemo10(
    () => [...tokensIn, pool?.token0, pool?.token1, NetworkInfo[chainId].wrappedToken],
    [chainId, pool?.token0, pool?.token1, tokensIn],
  )
  const addLiquidityInfo = zapInfo?.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_ADD_LIQUIDITY' /* ADD_LIQUIDITY */,
  )
  const addedAmount0 = formatUnits4(BigInt(addLiquidityInfo?.addLiquidity.token0.amount || '0'), token0?.decimals || 0)
  const addedAmount1 = formatUnits4(BigInt(addLiquidityInfo?.addLiquidity.token1.amount || '0'), token1?.decimals || 0)
  const refundInfo = zapInfo?.zapDetails.actions.find((item) => item.type === 'ACTION_TYPE_REFUND' /* REFUND */)
  const refundToken0 =
    refundInfo?.refund.tokens.filter((item) => item.address.toLowerCase() === token0?.address.toLowerCase()) || []
  const refundToken1 =
    refundInfo?.refund.tokens.filter((item) => item.address.toLowerCase() === token1?.address.toLowerCase()) || []
  const refundAmount0 = formatWei(
    refundToken0.reduce((acc, cur) => acc + BigInt(cur.amount), BigInt(0)).toString(),
    token0?.decimals,
  )
  const refundAmount1 = formatWei(
    refundToken1.reduce((acc, cur) => acc + BigInt(cur.amount), BigInt(0)).toString(),
    token1?.decimals,
  )
  const refundUsd = refundInfo?.refund.tokens.reduce((acc, cur) => acc + +cur.amountUsd, 0) || 0
  const aggregatorSwapInfo = zapInfo?.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP' /* AGGREGATOR_SWAP */,
  )
  const feeInfo = zapInfo?.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_PROTOCOL_FEE' /* PROTOCOL_FEE */,
  )
  const partnerFeeInfo = zapInfo?.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_PARTNER_FEE' /* PARTNET_FEE */,
  )
  const protocolFee = ((feeInfo?.protocolFee.pcm || 0) / 1e5) * 100
  const partnerFee = ((partnerFeeInfo?.partnerFee.pcm || 0) / 1e5) * 100
  const swapPi = useMemo10(() => {
    const aggregatorSwapInfo2 = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP' /* AGGREGATOR_SWAP */,
    )
    const poolSwapInfo = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_POOL_SWAP' /* POOL_SWAP */,
    )
    const parsedAggregatorSwapInfo =
      aggregatorSwapInfo2?.aggregatorSwap?.swaps?.map((item) => {
        const tokenIn = tokens.find((token) => token.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find((token) => token.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        const amountIn = formatWei(item.tokenIn.amount, tokenIn?.decimals)
        const amountOut = formatWei(item.tokenOut.amount, tokenOut?.decimals)
        const pi =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        const piRes2 = getPriceImpact(pi, 'Swap price' /* SWAP */, feeInfo)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes: piRes2,
        }
      }) || []
    const parsedPoolSwapInfo =
      poolSwapInfo?.poolSwap?.swaps?.map((item) => {
        const tokenIn = tokens.find((token) => token.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find((token) => token.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        const amountIn = formatWei(item.tokenIn.amount, tokenIn?.decimals)
        const amountOut = formatWei(item.tokenOut.amount, tokenOut?.decimals)
        const pi =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        const piRes2 = getPriceImpact(pi, 'Swap price' /* SWAP */, feeInfo)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes: piRes2,
        }
      }) || []
    return parsedAggregatorSwapInfo.concat(parsedPoolSwapInfo)
  }, [feeInfo, tokens, zapInfo])
  const swapPiRes = useMemo10(() => {
    const invalidRes = swapPi.find((item) => item.piRes.level === 'INVALID' /* INVALID */)
    if (invalidRes) return invalidRes
    const highRes = swapPi.find((item) => item.piRes.level === 'HIGH' /* HIGH */)
    if (highRes) return highRes
    const veryHighRes = swapPi.find((item) => item.piRes.level === 'VERY_HIGH' /* VERY_HIGH */)
    if (veryHighRes) return veryHighRes
    return { piRes: { level: 'NORMAL' /* NORMAL */, msg: '' } }
  }, [swapPi])
  const piRes = getPriceImpact(zapInfo?.zapDetails.priceImpact, 'Zap' /* ZAP */, feeInfo)
  const positionAmount0Usd =
    (+(position?.amount0.toExact() || 0) * +(addLiquidityInfo?.addLiquidity.token0.amountUsd || 0)) / +addedAmount0 || 0
  const positionAmount1Usd =
    (+(position?.amount1.toExact() || 0) * +(addLiquidityInfo?.addLiquidity.token1.amountUsd || 0)) / +addedAmount1 || 0
  const addedAmountUsd = +(zapInfo?.positionDetails.addedAmountUsd || 0) + positionAmount0Usd + positionAmount1Usd || 0
  const newData = zapInfo?.poolDetails.uniswapV3 || zapInfo?.poolDetails.algebraV1
  const newPool =
    zapInfo && pool && newData
      ? pool.newPool({
          sqrtRatioX96: newData.newSqrtP,
          tick: newData.newTick,
          liquidity: (pool.liquidity + BigInt(zapInfo.positionDetails.addedLiquidity)).toString(),
        })
      : null
  const isDevatied =
    !!marketPrice && newPool && Math.abs(marketPrice / +newPool.priceOf(newPool.token0).toSignificant() - 1) > 0.02
  const isOutOfRangeAfterZap =
    position && newPool ? newPool.tickCurrent < position.tickLower || newPool.tickCurrent >= position.tickUpper : false
  const price = newPool
    ? (revertPrice ? newPool.priceOf(newPool.token1) : newPool.priceOf(newPool.token0)).toSignificant(6)
    : '--'
  const marketRate = marketPrice ? formatNumber(revertPrice ? 1 / marketPrice : marketPrice) : null
  return /* @__PURE__ */ jsxs13(Fragment10, {
    children: [
      /* @__PURE__ */ jsx32('div', {
        className: 'text-xs font-medium text-secondary uppercase mt-6',
        children: 'Summary',
      }),
      /* @__PURE__ */ jsxs13('div', {
        className: 'ks-lw-card mt-2 flex flex-col gap-[10px]',
        children: [
          /* @__PURE__ */ jsxs13('div', {
            className: 'flex justify-between items-start text-sm',
            children: [
              'Est. Liquidity Value',
              !!addedAmountUsd &&
                /* @__PURE__ */ jsx32('span', {
                  className: 'text-base font-semibold',
                  children: formatCurrency(addedAmountUsd),
                }),
            ],
          }),
          /* @__PURE__ */ jsxs13('div', {
            className: 'flex justify-between items-center text-sm',
            children: [
              /* @__PURE__ */ jsxs13('div', {
                className: 'text-textSecondary w-fit text-sm font-normal normal-case',
                children: ['Est. Pooled ', token0?.symbol],
              }),
              zapInfo
                ? /* @__PURE__ */ jsxs13('div', {
                    children: [
                      /* @__PURE__ */ jsxs13('div', {
                        className: 'flex justify-end items-start gap-1',
                        children: [
                          token0?.logoURI &&
                            /* @__PURE__ */ jsx32('img', {
                              src: token0.logoURI,
                              className: 'w-[21px] mt-[2px] rounded-[50%] relative -top-[2px]',
                              onError: ({ currentTarget }) => {
                                currentTarget.onerror = null
                                currentTarget.src = question_default
                              },
                            }),
                          position
                            ? /* @__PURE__ */ jsxs13('div', {
                                className: 'text-end',
                                children: [formatNumber(+position.amount0.toExact()), ' ', token0?.symbol],
                              })
                            : /* @__PURE__ */ jsxs13('div', {
                                className: 'text-end',
                                children: [formatNumber(+addedAmount0), ' ', token0?.symbol],
                              }),
                        ],
                      }),
                      position &&
                        /* @__PURE__ */ jsxs13('div', {
                          className: 'text-end',
                          children: ['+ ', formatNumber(+addedAmount0), ' ', token0?.symbol],
                        }),
                      /* @__PURE__ */ jsxs13('div', {
                        className: 'text-textSecondary w-fit text-sm font-normal normal-case ml-auto',
                        children: [
                          '~',
                          formatCurrency(+(addLiquidityInfo?.addLiquidity.token0.amountUsd || 0) + positionAmount0Usd),
                        ],
                      }),
                    ],
                  })
                : '--',
            ],
          }),
          /* @__PURE__ */ jsxs13('div', {
            className: 'flex justify-between items-center text-sm',
            children: [
              /* @__PURE__ */ jsxs13('div', {
                className: 'text-textSecondary w-fit text-sm font-normal normal-case',
                children: ['Est. Pooled ', token1?.symbol],
              }),
              zapInfo
                ? /* @__PURE__ */ jsxs13('div', {
                    children: [
                      /* @__PURE__ */ jsxs13('div', {
                        className: 'flex justify-end items-start gap-1',
                        children: [
                          token1?.logoURI &&
                            /* @__PURE__ */ jsx32('img', {
                              src: token1.logoURI,
                              className: 'w-[21px] mt-[2px] rounded-[50%] relative -top-[2px]',
                              onError: ({ currentTarget }) => {
                                currentTarget.onerror = null
                                currentTarget.src = question_default
                              },
                            }),
                          position
                            ? /* @__PURE__ */ jsxs13('div', {
                                className: 'text-end',
                                children: [formatNumber(+position.amount1.toExact()), ' ', token1?.symbol],
                              })
                            : /* @__PURE__ */ jsxs13('div', {
                                className: 'text-end',
                                children: [formatNumber(+addedAmount1), ' ', token1?.symbol],
                              }),
                        ],
                      }),
                      position &&
                        /* @__PURE__ */ jsxs13('div', {
                          className: 'text-end',
                          children: ['+ ', formatNumber(+addedAmount1), ' ', token1?.symbol],
                        }),
                      /* @__PURE__ */ jsxs13('div', {
                        className: 'text-textSecondary w-fit text-sm font-normal normal-case ml-auto',
                        children: [
                          '~',
                          formatCurrency(+(addLiquidityInfo?.addLiquidity.token1.amountUsd || 0) + positionAmount1Usd),
                        ],
                      }),
                    ],
                  })
                : '--',
            ],
          }),
          /* @__PURE__ */ jsxs13('div', {
            className: 'flex justify-between items-start text-sm',
            children: [
              /* @__PURE__ */ jsx32(MouseoverTooltip, {
                text: 'Based on your price range settings, a portion of your liquidity will be automatically zapped into the pool, while the remaining amount will stay in your wallet.',
                width: '220px',
                children: /* @__PURE__ */ jsx32('div', {
                  className:
                    'text-textSecondary w-fit text-sm font-normal normal-case border-b border-dotted border-textSecondary',
                  children: 'Est. Remaining Value',
                }),
              }),
              /* @__PURE__ */ jsxs13('div', {
                children: [
                  formatCurrency(refundUsd),
                  /* @__PURE__ */ jsx32(InfoHelper, {
                    text: /* @__PURE__ */ jsxs13('div', {
                      children: [
                        /* @__PURE__ */ jsxs13('div', { children: [refundAmount0, ' ', token0?.symbol, ' '] }),
                        /* @__PURE__ */ jsxs13('div', { children: [refundAmount1, ' ', token1?.symbol] }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsx32('div', {
            className: 'flex justify-between items-start text-sm',
            children: swapPi.length
              ? /* @__PURE__ */ jsx32(Accordion2, {
                  type: 'single',
                  collapsible: true,
                  className: 'w-full',
                  children: /* @__PURE__ */ jsxs13(AccordionItem2, {
                    value: 'item-1',
                    children: [
                      /* @__PURE__ */ jsx32(AccordionTrigger2, {
                        className: 'transition-all [&[data-state=open]>svg]:rotate-180',
                        children: /* @__PURE__ */ jsx32(MouseoverTooltip, {
                          text: 'View all the detailed estimated price impact of each swap',
                          width: '220px',
                          children: /* @__PURE__ */ jsx32('div', {
                            className: `text-textSecondary w-fit text-sm font-normal normal-case border-b border-dotted border-textSecondary ${
                              swapPiRes.piRes.level === 'NORMAL' /* NORMAL */
                                ? ''
                                : swapPiRes.piRes.level === 'HIGH' /* HIGH */
                                ? '!text-warning !border-warning'
                                : '!text-error !border-error'
                            }`,
                            children: 'Swap Impact',
                          }),
                        }),
                      }),
                      /* @__PURE__ */ jsx32(AccordionContent2, {
                        className: 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
                        children: swapPi.map((item, index) =>
                          /* @__PURE__ */ jsxs13(
                            'div',
                            {
                              className: `text-xs flex justify-between align-middle text-textSecondary mt-1 ${
                                index === 0 ? 'mt-2' : ''
                              } ${
                                item.piRes.level === 'NORMAL' /* NORMAL */
                                  ? 'brightness-125'
                                  : item.piRes.level === 'HIGH' /* HIGH */
                                  ? '!text-warning'
                                  : '!text-error'
                              }`,
                              children: [
                                /* @__PURE__ */ jsxs13('div', {
                                  className: 'ml-3',
                                  children: [
                                    item.amountIn,
                                    ' ',
                                    item.tokenInSymbol,
                                    ' ',
                                    '\u2192 ',
                                    item.amountOut,
                                    ' ',
                                    item.tokenOutSymbol,
                                  ],
                                }),
                                /* @__PURE__ */ jsx32('div', { children: item.piRes.display }),
                              ],
                            },
                            index,
                          ),
                        ),
                      }),
                    ],
                  }),
                })
              : /* @__PURE__ */ jsxs13(Fragment10, {
                  children: [
                    /* @__PURE__ */ jsx32(MouseoverTooltip, {
                      text: 'Estimated change in price due to the size of your transaction. Applied to the Swap steps.',
                      width: '220px',
                      children: /* @__PURE__ */ jsx32('div', {
                        className:
                          'text-textSecondary w-fit text-sm font-normal normal-case border-b border-dotted border-textSecondary',
                        children: 'Swap Impact',
                      }),
                    }),
                    /* @__PURE__ */ jsx32('span', { children: '--' }),
                  ],
                }),
          }),
          /* @__PURE__ */ jsxs13('div', {
            className: 'flex justify-between items-start text-sm',
            children: [
              /* @__PURE__ */ jsx32(MouseoverTooltip, {
                text: 'The difference between input and estimated liquidity received (including remaining amount). Be careful with high value!',
                width: '220px',
                children: /* @__PURE__ */ jsx32('div', {
                  className:
                    'text-textSecondary w-fit text-sm font-normal normal-case border-b border-dotted border-textSecondary',
                  children: 'Zap Impact',
                }),
              }),
              zapInfo
                ? /* @__PURE__ */ jsx32('div', {
                    className:
                      piRes.level === 'VERY_HIGH' /* VERY_HIGH */ || piRes.level === 'INVALID' /* INVALID */
                        ? 'text-error'
                        : piRes.level === 'HIGH' /* HIGH */
                        ? 'text-warning'
                        : 'text-textPrimary',
                    children: piRes.display,
                  })
                : '--',
            ],
          }),
          /* @__PURE__ */ jsxs13('div', {
            className: 'flex justify-between items-start text-sm',
            children: [
              /* @__PURE__ */ jsx32(MouseoverTooltip, {
                placement: 'bottom',
                text: /* @__PURE__ */ jsxs13('div', {
                  children: [
                    'Fees charged for automatically zapping into a liquidity pool. You still have to pay the standard gas fees.',
                    ' ',
                    /* @__PURE__ */ jsx32('a', {
                      className: 'text-warning',
                      href: 'https://docs.kyberswap.com/kyberswap-solutions/kyberswap-zap-as-a-service/zap-fee-model',
                      target: '_blank',
                      rel: 'noopener norefferer',
                      children: 'More details.',
                    }),
                  ],
                }),
                width: '220px',
                children: /* @__PURE__ */ jsx32('div', {
                  className:
                    'text-textSecondary w-fit text-sm font-normal normal-case border-b border-dotted border-textSecondary',
                  children: 'Zap Fee',
                }),
              }),
              /* @__PURE__ */ jsx32(MouseoverTooltip, {
                text: partnerFee
                  ? `${parseFloat(protocolFee.toFixed(3))}% Protocol Fee + ${parseFloat(
                      partnerFee.toFixed(3),
                    )}% Fee for ${source}`
                  : '',
                children: /* @__PURE__ */ jsx32('div', {
                  className: feeInfo || partnerFee ? 'border-b border-dotted border-textSecondary' : '',
                  children: feeInfo || partnerFee ? parseFloat((protocolFee + partnerFee).toFixed(3)) + '%' : '--',
                }),
              }),
            ],
          }),
          aggregatorSwapInfo &&
            swapPiRes.piRes.level !== 'NORMAL' /* NORMAL */ &&
            /* @__PURE__ */ jsx32('div', { className: 'ks-lw-card-warning mt-3', children: swapPiRes.piRes.msg }),
          zapInfo &&
            piRes.level !== 'NORMAL' /* NORMAL */ &&
            /* @__PURE__ */ jsx32('div', { className: 'ks-lw-card-warning mt-3', children: piRes.msg }),
          isOutOfRangeAfterZap &&
            /* @__PURE__ */ jsxs13('div', {
              className: 'ks-lw-card-warning mt-3',
              children: [
                'The position will be ',
                /* @__PURE__ */ jsx32('span', { className: 'text-warning', children: 'inactive' }),
                ' ',
                'after zapping and',
                ' ',
                /* @__PURE__ */ jsx32('span', { className: 'text-warning', children: 'won\u2019t earn any fees' }),
                ' until the pool price moves back to select price range',
              ],
            }),
          isDevatied &&
            /* @__PURE__ */ jsx32('div', {
              className: 'ks-lw-card-warning mt-3',
              children: /* @__PURE__ */ jsxs13('div', {
                className: 'text',
                children: [
                  "The pool's estimated price after zapping:",
                  ' ',
                  /* @__PURE__ */ jsxs13('span', {
                    className: 'font-medium text-warning ml-[2px] not-italic',
                    children: [price, ' '],
                  }),
                  ' ',
                  revertPrice ? token0?.symbol : token1?.symbol,
                  ' per',
                  ' ',
                  revertPrice ? token1?.symbol : token0?.symbol,
                  ' deviates from the market price:',
                  ' ',
                  /* @__PURE__ */ jsxs13('span', {
                    className: 'font-medium text-warning not-italic',
                    children: [marketRate, ' '],
                  }),
                  revertPrice ? token0?.symbol : token1?.symbol,
                  ' per',
                  ' ',
                  revertPrice ? token1?.symbol : token0?.symbol,
                  '. You might have high impermanent loss after you add liquidity to this pool',
                ],
              }),
            }),
          isNotOwnByUser &&
            !isOwnByFarmContract &&
            /* @__PURE__ */ jsxs13('div', {
              className: 'ks-lw-card-warning mt-3',
              children: [
                'You are not the current owner of the position',
                ' ',
                /* @__PURE__ */ jsxs13('span', { className: 'text-warning', children: ['#', positionId] }),
                ', please double check before proceeding',
              ],
            }),
        ],
      }),
    ],
  })
}

// src/assets/setting.svg
import * as React23 from 'react'
import { jsx as jsx33, jsxs as jsxs14 } from 'react/jsx-runtime'
var SvgSetting = (props) =>
  /* @__PURE__ */ jsxs14('svg', {
    width: 24,
    height: 25,
    viewBox: '0 0 24 25',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: [
      /* @__PURE__ */ jsxs14('g', {
        clipPath: 'url(#clip0_134_4060)',
        children: [
          /* @__PURE__ */ jsxs14('mask', {
            id: 'mask0_134_4060',
            style: {
              maskType: 'alpha',
            },
            maskUnits: 'userSpaceOnUse',
            x: 0,
            y: 0,
            width: 24,
            height: 25,
            children: [
              /* @__PURE__ */ jsx33('mask', {
                id: 'mask1_134_4060',
                style: {
                  maskType: 'alpha',
                },
                maskUnits: 'userSpaceOnUse',
                x: 0,
                y: 0,
                width: 24,
                height: 25,
                children: /* @__PURE__ */ jsx33('rect', { y: 0.5, width: 24, height: 24, fill: '#D9D9D9' }),
              }),
              /* @__PURE__ */ jsx33('g', {
                mask: 'url(#mask1_134_4060)',
                children: /* @__PURE__ */ jsx33('path', {
                  d: 'M10.8864 22.3032C10.583 22.3032 10.3244 22.2149 10.1104 22.0382C9.89653 21.8616 9.76462 21.63 9.71462 21.3435L9.33962 19.3875C8.98812 19.2495 8.64612 19.0884 8.31362 18.9042C7.98128 18.7202 7.6687 18.5049 7.37587 18.2582L5.50687 18.9082C5.24103 18.9956 4.96895 18.9924 4.69062 18.8987C4.41228 18.8051 4.20253 18.6316 4.06137 18.3782L2.94762 16.419C2.80628 16.1697 2.76161 15.9069 2.81361 15.6307C2.86561 15.3544 2.99962 15.1206 3.21562 14.9292L4.68462 13.6292C4.65528 13.4452 4.63228 13.2612 4.61562 13.0772C4.59895 12.8931 4.59062 12.7007 4.59062 12.5C4.59062 12.2993 4.59895 12.1069 4.61562 11.9227C4.63228 11.7387 4.65528 11.5547 4.68462 11.3707L3.21562 10.0767C2.99562 9.88541 2.86061 9.65158 2.81061 9.37525C2.76061 9.09891 2.80628 8.83416 2.94762 8.581L4.06137 6.62775C4.20253 6.37841 4.41128 6.20591 4.68762 6.11025C4.96395 6.01458 5.23503 6.01041 5.50086 6.09775L7.38787 6.74775C7.6807 6.50108 7.99028 6.28666 8.31662 6.1045C8.64312 5.9225 8.98412 5.7625 9.33962 5.6245L9.71462 3.6625C9.76462 3.372 9.89653 3.13841 10.1104 2.96175C10.3244 2.78508 10.583 2.69675 10.8864 2.69675H13.1134C13.4167 2.69675 13.6754 2.78508 13.8894 2.96175C14.1032 3.13841 14.2351 3.372 14.2851 3.6625L14.6601 5.6245C15.0116 5.7625 15.3536 5.9225 15.6861 6.1045C16.0184 6.28666 16.331 6.50108 16.6239 6.74775L18.4929 6.09775C18.7587 6.01041 19.0308 6.01458 19.3091 6.11025C19.5874 6.20591 19.7972 6.37841 19.9384 6.62775L21.0521 8.581C21.1934 8.83416 21.2391 9.09891 21.1891 9.37525C21.1391 9.65158 21.0041 9.88541 20.7841 10.0767L19.3091 11.3707C19.3384 11.5547 19.3614 11.7387 19.3781 11.9227C19.3948 12.1069 19.4031 12.2993 19.4031 12.5C19.4031 12.7007 19.3938 12.8931 19.3751 13.0772C19.3564 13.2612 19.3344 13.4452 19.3091 13.6292L20.7841 14.9232C21.0041 15.1146 21.1391 15.3484 21.1891 15.6247C21.2391 15.9011 21.1934 16.1658 21.0521 16.419L19.9384 18.3782C19.7972 18.6276 19.5884 18.8001 19.3121 18.8957C19.0358 18.9914 18.7647 18.9956 18.4989 18.9082L16.6119 18.2582C16.319 18.5049 16.0094 18.7202 15.6831 18.9042C15.3566 19.0884 15.0156 19.2495 14.6601 19.3875L14.2851 21.3435C14.2351 21.63 14.1032 21.8616 13.8894 22.0382C13.6754 22.2149 13.4167 22.3032 13.1134 22.3032H10.8864ZM11.9819 16.1C12.9819 16.1 13.8319 15.75 14.5319 15.05C15.2319 14.35 15.5819 13.5 15.5819 12.5C15.5819 11.5 15.2319 10.65 14.5319 9.95C13.8319 9.25 12.9819 8.9 11.9819 8.9C10.9859 8.9 10.1369 9.25 9.43486 9.95C8.73286 10.65 8.38187 11.5 8.38187 12.5C8.38187 13.5 8.73286 14.35 9.43486 15.05C10.1369 15.75 10.9859 16.1 11.9819 16.1Z',
                  fill: '#1C1B1F',
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsx33('g', {
            mask: 'url(#mask0_134_4060)',
            children: /* @__PURE__ */ jsx33('rect', { y: 0.5, width: 24, height: 24, fill: 'currentColor' }),
          }),
        ],
      }),
      /* @__PURE__ */ jsx33('defs', {
        children: /* @__PURE__ */ jsx33('clipPath', {
          id: 'clip0_134_4060',
          children: /* @__PURE__ */ jsx33('rect', {
            width: 24,
            height: 24,
            fill: 'white',
            transform: 'translate(0 0.5)',
          }),
        }),
      }),
    ],
  })
var setting_default = SvgSetting

// src/components/Header/index.tsx
import { Fragment as Fragment11, jsx as jsx34, jsxs as jsxs15 } from 'react/jsx-runtime'
var Header2 = ({ onDismiss }) => {
  return /* @__PURE__ */ jsxs15(Fragment11, {
    children: [
      /* @__PURE__ */ jsxs15('div', {
        className:
          'flex text-xl font-semibold justify-between items-center text-textPrimary py-4 px-6 border-b border-b-cardBorder',
        children: [
          /* @__PURE__ */ jsxs15('div', {
            children: [
              'Zap in',
              ' ',
              /* @__PURE__ */ jsx34('span', {
                className: 'text-textSecondary text-base font-normal',
                children: '- Optimise liquidity ratio easily',
              }),
            ],
          }),
          /* @__PURE__ */ jsx34('div', {
            className: 'cursor-pointer text-textSecondary',
            role: 'button',
            onClick: onDismiss,
            children: /* @__PURE__ */ jsx34(x_default, {}),
          }),
        ],
      }),
      /* @__PURE__ */ jsx34(PoolInfo, {}),
    ],
  })
}
var PoolInfo = () => {
  const { chainId } = useWeb3Provider()
  const { loading, pool, positionId, position, theme } = useWidgetInfo()
  const { toggleSetting, degenMode } = useZapState()
  if (loading)
    return /* @__PURE__ */ jsx34('div', { className: 'flex justify-between items-center p-6', children: 'Loading...' })
  if (!pool)
    return /* @__PURE__ */ jsx34('div', {
      className: 'flex justify-between items-center p-6',
      children: "Can't get pool info",
    })
  const token0 = pool.token0
  const token1 = pool.token1
  const fee = pool.fee
  const logo = getDexLogo()
  const name = getDexName()
  const isOutOfRange = position
    ? pool.tickCurrent < position.tickLower || pool.tickCurrent >= position.tickUpper
    : false
  return /* @__PURE__ */ jsxs15('div', {
    className: 'flex justify-between items-center p-6',
    children: [
      /* @__PURE__ */ jsxs15('div', {
        className: 'flex items-center gap-3',
        children: [
          /* @__PURE__ */ jsxs15('div', {
            className: 'relative w-12 h-12',
            children: [
              /* @__PURE__ */ jsx34('img', {
                className: 'absolute w-7 h-7 top-0 left-0 rounded-[50%]',
                src: token0.logoURI,
                alt: '',
                onError: ({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = question_default
                },
              }),
              /* @__PURE__ */ jsx34('img', {
                className: 'absolute w-9 h-9 bottom-0 right-0 rounded-[50%]',
                src: token1.logoURI,
                alt: '',
                onError: ({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = question_default
                },
              }),
              /* @__PURE__ */ jsx34('div', {
                className:
                  'absolute w-4 h-4 bg-[#1e1e1e] rounded-[5px] flex items-center justify-center bottom-0 right-0',
                children: /* @__PURE__ */ jsx34('img', {
                  className: 'rounded-[50%]',
                  src: NetworkInfo[chainId].logo,
                  width: '12px',
                  height: '12px',
                  onError: ({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = question_default
                  },
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxs15('div', {
            children: [
              /* @__PURE__ */ jsxs15('span', {
                className: 'text-2xl font-semibold flex items-center gap-1',
                children: [
                  token0.symbol,
                  ' ',
                  /* @__PURE__ */ jsx34('span', { className: 'text-textSecondary', children: '/' }),
                  ' ',
                  token1.symbol,
                  positionId &&
                    /* @__PURE__ */ jsxs15('span', {
                      className: 'text-textSecondary text-xl',
                      children: ['#', positionId],
                    }),
                ],
              }),
              /* @__PURE__ */ jsxs15('div', {
                className: 'flex gap-2 mt-1 leading-5',
                children: [
                  positionId &&
                    (!isOutOfRange
                      ? /* @__PURE__ */ jsx34('div', {
                          className:
                            'rounded-full py-0 px-2 h-6 text-sm flex items-center gap-1 box-border border border-green20 text-green50 bg-green10',
                          children: 'Active',
                        })
                      : /* @__PURE__ */ jsx34('div', {
                          className:
                            'rounded-full py-0 px-2 h-6 text-sm flex items-center gap-1 box-border border border-warningBorder text-warning bg-warningBackground',
                          children: 'Inactive',
                        })),
                  /* @__PURE__ */ jsxs15('div', {
                    className:
                      'rounded-full py-0 px-2 h-6 bg-tertiary text-textSecondary text-sm flex items-center gap-1 box-border',
                    children: [
                      /* @__PURE__ */ jsx34('img', {
                        src: logo,
                        width: 16,
                        height: 16,
                        alt: '',
                        onError: ({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src = question_default
                        },
                      }),
                      /* @__PURE__ */ jsx34('span', { children: name }),
                      /* @__PURE__ */ jsx34('span', { children: '|' }),
                      'Fee ',
                      fee / BASE_BPS,
                      '%',
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsx34(MouseoverTooltip, {
        text: degenMode ? 'Degen Mode is turned on!' : '',
        children: /* @__PURE__ */ jsx34('div', {
          className:
            'setting w-9 h-9 hover:brightness-120 rounded-full flex items-center justify-center cursor-pointer',
          role: 'button',
          onClick: (e) => {
            e.stopPropagation()
            e.preventDefault()
            toggleSetting()
          },
          style: {
            background: degenMode ? theme.warning + '33' : void 0,
            color: degenMode ? theme.warning : void 0,
          },
          children: /* @__PURE__ */ jsx34(setting_default, {
            className: degenMode ? 'text-warning' : 'text-textSecondary',
          }),
        }),
      }),
    ],
  })
}
var Header_default = Header2

// src/components/Preview/index.tsx
import { useEffect as useEffect17, useMemo as useMemo11, useState as useState19 } from 'react'
import { formatUnits as formatUnits5 } from 'viem'

// src/assets/dropdown.svg
import * as React24 from 'react'
import { jsx as jsx35 } from 'react/jsx-runtime'
var SvgDropdown = (props) =>
  /* @__PURE__ */ jsx35('svg', {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: /* @__PURE__ */ jsx35('path', {
      d: 'M8.71005 11.71L11.3001 14.3C11.6901 14.69 12.3201 14.69 12.7101 14.3L15.3001 11.71C15.9301 11.08 15.4801 10 14.5901 10H9.41005C8.52005 10 8.08005 11.08 8.71005 11.71Z',
      fill: 'currentColor',
    }),
  })
var dropdown_default = SvgDropdown

// src/assets/loader.svg
import * as React25 from 'react'
import { jsx as jsx36 } from 'react/jsx-runtime'
var SvgLoader = (props) =>
  /* @__PURE__ */ jsx36('svg', {
    width: 94,
    height: 94,
    viewBox: '0 0 94 94',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: /* @__PURE__ */ jsx36('path', {
      d: 'M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92',
      stroke: 'currentColor',
      strokeWidth: 3,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  })
var loader_default = SvgLoader

// src/assets/success.svg
import * as React26 from 'react'
import { jsx as jsx37, jsxs as jsxs16 } from 'react/jsx-runtime'
var SvgSuccess = (props) =>
  /* @__PURE__ */ jsxs16('svg', {
    width: 92,
    height: 92,
    viewBox: '0 0 92 92',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: [
      /* @__PURE__ */ jsx37('circle', { cx: 46.5111, cy: 46.5111, r: 37.3333, stroke: 'currentColor', strokeWidth: 2 }),
      /* @__PURE__ */ jsx37('path', {
        d: 'M25.0483 46.1748L39.5042 60.8219L67.5898 32.7832',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
      }),
    ],
  })
var success_default = SvgSuccess

// src/assets/error.svg
import * as React27 from 'react'
import { jsx as jsx38, jsxs as jsxs17 } from 'react/jsx-runtime'
var SvgError = (props) =>
  /* @__PURE__ */ jsxs17('svg', {
    width: 92,
    height: 92,
    viewBox: '0 0 92 92',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
    children: [
      /* @__PURE__ */ jsx38('path', {
        d: 'M40.4664 14.797L7.99811 69.0003C7.32869 70.1596 6.97448 71.4739 6.97073 72.8126C6.96698 74.1513 7.31382 75.4676 7.97674 76.6306C8.63966 77.7937 9.59556 78.7628 10.7493 79.4417C11.9031 80.1206 13.2145 80.4856 14.5531 80.5003H79.4898C80.8284 80.4856 82.1398 80.1206 83.2936 79.4417C84.4473 78.7628 85.4032 77.7937 86.0661 76.6306C86.7291 75.4676 87.0759 74.1513 87.0722 72.8126C87.0684 71.4739 86.7142 70.1596 86.0448 69.0003L53.5764 14.797C52.8931 13.6704 51.9309 12.7389 50.7827 12.0925C49.6345 11.446 48.3391 11.1064 47.0214 11.1064C45.7038 11.1064 44.4084 11.446 43.2602 12.0925C42.112 12.7389 41.1498 13.6704 40.4664 14.797V14.797Z',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
      /* @__PURE__ */ jsx38('path', {
        d: 'M47.0225 34.5V49.8333',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
      /* @__PURE__ */ jsx38('path', {
        d: 'M47.0225 65.1665H47.06',
        stroke: 'currentColor',
        strokeWidth: 4,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
    ],
  })
var error_default = SvgError

// src/components/Preview/index.tsx
import { Fragment as Fragment12, jsx as jsx39, jsxs as jsxs18 } from 'react/jsx-runtime'
function Preview({
  zapState: { pool, zapInfo, tokensIn, amountsIn, priceLower, priceUpper, deadline, slippage, tickLower, tickUpper },
  onDismiss,
  onTxSubmit,
}) {
  const { chainId, account, publicClient, walletClient } = useWeb3Provider()
  const { positionId, position } = useWidgetInfo()
  const { source, revertPrice: revert, toggleRevertPrice } = useZapState()
  const [txHash, setTxHash] = useState19(void 0)
  const [attempTx, setAttempTx] = useState19(false)
  const [txError, setTxError] = useState19(null)
  const [txStatus, setTxStatus] = useState19('')
  const [showErrorDetail, setShowErrorDetail] = useState19(false)
  const { fetchPrices } = useTokenPrices({ addresses: [], chainId })
  const token0 = pool.token0
  const token1 = pool.token1
  const tokens = useMemo11(
    () => [...tokensIn, pool?.token0, pool?.token1, NetworkInfo[chainId].wrappedToken],
    [chainId, pool?.token0, pool?.token1, tokensIn],
  )
  useEffect17(() => {
    if (txHash) {
      publicClient
        ?.waitForTransactionReceipt({
          hash: txHash,
        })
        .then((res) => {
          if (res.status === 'success') {
            setTxStatus('success')
          } else {
            setTxStatus('failed')
          }
        })
    }
  }, [publicClient, txHash])
  const addedLiqInfo = zapInfo.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_ADD_LIQUIDITY' /* ADD_LIQUIDITY */,
  )
  const addedAmount0 = formatUnits5(BigInt(addedLiqInfo?.addLiquidity.token0.amount), pool.token0.decimals)
  const addedAmount1 = formatUnits5(BigInt(addedLiqInfo?.addLiquidity.token1.amount), pool.token1.decimals)
  const positionAmount0Usd =
    (+(position?.amount0.toExact() || 0) * +(addedLiqInfo?.addLiquidity.token0.amountUsd || 0)) / +addedAmount0 || 0
  const positionAmount1Usd =
    (+(position?.amount1.toExact() || 0) * +(addedLiqInfo?.addLiquidity.token1.amountUsd || 0)) / +addedAmount1 || 0
  const refundInfo = zapInfo.zapDetails.actions.find((item) => item.type === 'ACTION_TYPE_REFUND' /* REFUND */)
  const refundToken0 =
    refundInfo?.refund.tokens.filter((item) => item.address.toLowerCase() === pool.token0.address.toLowerCase()) || []
  const refundToken1 =
    refundInfo?.refund.tokens.filter((item) => item.address.toLowerCase() === pool.token1.address.toLowerCase()) || []
  const refundAmount0 = formatWei(
    refundToken0.reduce((acc, cur) => acc + BigInt(cur.amount), BigInt(0)).toString(),
    pool.token0.decimals,
  )
  const refundAmount1 = formatWei(
    refundToken1.reduce((acc, cur) => acc + BigInt(cur.amount), BigInt(0)).toString(),
    pool.token1.decimals,
  )
  const refundUsd = refundInfo?.refund.tokens.reduce((acc, cur) => acc + +cur.amountUsd, 0) || 0
  const price = pool ? (revert ? pool.priceOf(pool.token1) : pool.priceOf(pool.token0)).toSignificant(6) : '--'
  const leftPrice = !revert ? priceLower : priceUpper?.invert()
  const rightPrice = !revert ? priceUpper : priceLower?.invert()
  const quote = /* @__PURE__ */ jsx39('span', {
    children: revert
      ? `${pool?.token0.symbol} per ${pool?.token1.symbol}`
      : `${pool?.token1.symbol} per ${pool?.token0.symbol}`,
  })
  const feeInfo = zapInfo?.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_PROTOCOL_FEE' /* PROTOCOL_FEE */,
  )
  const partnerFeeInfo = zapInfo?.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_PARTNER_FEE' /* PARTNET_FEE */,
  )
  const protocolFee = ((feeInfo?.protocolFee.pcm || 0) / 1e5) * 100
  const partnerFee = ((partnerFeeInfo?.partnerFee.pcm || 0) / 1e5) * 100
  const aggregatorSwapInfo = zapInfo.zapDetails.actions.find(
    (item) => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP' /* AGGREGATOR_SWAP */,
  )
  const piRes = getPriceImpact(zapInfo?.zapDetails.priceImpact, 'Zap' /* ZAP */, feeInfo)
  const [gasUsd, setGasUsd] = useState19(null)
  useEffect17(() => {
    if (!publicClient) {
      return
    }
    fetch(`${ZAP_URL}/${chainIdToChain[chainId]}/api/v1/in/route/build`, {
      method: 'POST',
      body: JSON.stringify({
        sender: account,
        recipient: account,
        route: zapInfo.route,
        deadline,
        source,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        const { data } = res || {}
        if (data.callData) {
          const txData = {
            account,
            to: data.routerAddress,
            data: data.callData,
            value: BigInt(data.value),
          }
          try {
            const wethAddress = NetworkInfo[chainId].wrappedToken.address.toLowerCase()
            const [estimateGas, priceRes, gasPrice] = await Promise.all([
              publicClient.estimateGas(txData),
              fetchPrices([wethAddress]),
              publicClient.getGasPrice(),
            ])
            const price2 = priceRes?.[wethAddress]?.PriceBuy || 0
            const gasUsd2 = +formatUnits5(gasPrice, 18) * +estimateGas.toString() * price2
            setGasUsd(gasUsd2)
          } catch (e) {
            console.log('Estimate gas failed', e)
          }
        }
      })
  }, [account, chainId, deadline, publicClient, source, zapInfo.route])
  const handleClick = async () => {
    if (!publicClient || !account || !walletClient) {
      return
    }
    setAttempTx(true)
    setTxHash(void 0)
    setTxError(null)
    fetch(`${ZAP_URL}/${chainIdToChain[chainId]}/api/v1/in/route/build`, {
      method: 'POST',
      body: JSON.stringify({
        sender: account,
        recipient: account,
        route: zapInfo.route,
        deadline,
        source,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        const { data } = res || {}
        if (data.callData) {
          const txData = {
            account,
            to: data.routerAddress,
            data: data.callData,
            value: BigInt(data.value),
          }
          try {
            const estimateGas = await publicClient.estimateGas(txData)
            const hash = await walletClient.sendTransaction({
              ...txData,
              gas: calculateGasMargin(estimateGas) + BigInt(3e5),
              chain: walletClient.chain,
            })
            setTxHash(hash)
            onTxSubmit?.(hash)
          } catch (e) {
            setAttempTx(false)
            setTxError(e)
          }
        }
      })
      .finally(() => setAttempTx(false))
  }
  const warningThreshold = ((feeInfo ? getWarningThreshold(feeInfo) : 1) / 100) * 1e4
  const listAmountsIn = useMemo11(() => amountsIn.split(','), [amountsIn])
  const swapPi = useMemo11(() => {
    const aggregatorSwapInfo2 = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP' /* AGGREGATOR_SWAP */,
    )
    const poolSwapInfo = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_POOL_SWAP' /* POOL_SWAP */,
    )
    const parsedAggregatorSwapInfo =
      aggregatorSwapInfo2?.aggregatorSwap?.swaps?.map((item) => {
        const tokenIn = tokens.find((token) => token.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find((token) => token.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        const amountIn = formatWei(item.tokenIn.amount, tokenIn?.decimals)
        const amountOut = formatWei(item.tokenOut.amount, tokenOut?.decimals)
        const pi =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        const piRes2 = getPriceImpact(pi, 'Swap price' /* SWAP */, feeInfo)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes: piRes2,
        }
      }) || []
    const parsedPoolSwapInfo =
      poolSwapInfo?.poolSwap?.swaps?.map((item) => {
        const tokenIn = tokens.find((token) => token.address.toLowerCase() === item.tokenIn.address.toLowerCase())
        const tokenOut = tokens.find((token) => token.address.toLowerCase() === item.tokenOut.address.toLowerCase())
        const amountIn = formatWei(item.tokenIn.amount, tokenIn?.decimals)
        const amountOut = formatWei(item.tokenOut.amount, tokenOut?.decimals)
        const pi =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        const piRes2 = getPriceImpact(pi, 'Swap price' /* SWAP */, feeInfo)
        return {
          tokenInSymbol: tokenIn?.symbol || '--',
          tokenOutSymbol: tokenOut?.symbol || '--',
          amountIn,
          amountOut,
          piRes: piRes2,
        }
      }) || []
    return parsedAggregatorSwapInfo.concat(parsedPoolSwapInfo)
  }, [feeInfo, tokens, zapInfo])
  const swapPiRes = useMemo11(() => {
    const invalidRes = swapPi.find((item) => item.piRes.level === 'INVALID' /* INVALID */)
    if (invalidRes) return invalidRes
    const highRes = swapPi.find((item) => item.piRes.level === 'HIGH' /* HIGH */)
    if (highRes) return highRes
    const veryHighRes = swapPi.find((item) => item.piRes.level === 'VERY_HIGH' /* VERY_HIGH */)
    if (veryHighRes) return veryHighRes
    return { piRes: { level: 'NORMAL' /* NORMAL */, msg: '' } }
  }, [swapPi])
  if (attempTx || txHash) {
    let txStatusText = ''
    if (txHash) {
      if (txStatus === 'success') txStatusText = 'Transaction successful'
      else if (txStatus === 'failed') txStatusText = 'Transaction failed'
      else txStatusText = 'Processing transaction'
    } else {
      txStatusText = 'Waiting For Confirmation'
    }
    return /* @__PURE__ */ jsxs18('div', {
      className: 'mt-4 gap-4 flex flex-col justify-center items-center text-base font-medium',
      children: [
        /* @__PURE__ */ jsxs18('div', {
          className: 'min-h-[300px] flex justify-center items-center gap-3 flex-col flex-1',
          children: [
            txStatus === 'success'
              ? /* @__PURE__ */ jsx39(success_default, { className: 'text-green50' })
              : txStatus === 'failed'
              ? /* @__PURE__ */ jsx39(error_default, { className: 'text-error' })
              : /* @__PURE__ */ jsx39(loader_default, {
                  className: 'text-green50 animate-spin duration-2000 ease-linear',
                }),
            /* @__PURE__ */ jsx39('div', { children: txStatusText }),
            !txHash &&
              /* @__PURE__ */ jsxs18('div', {
                className: 'text-sm text-textSecondary text-center',
                children: [
                  'Confirm this transaction in your wallet - Zapping',
                  ' ',
                  positionId
                    ? `Position #${positionId}`
                    : `${getDexName()} ${pool.token0.symbol}/${pool.token1.symbol} ${pool.fee / 1e4}%`,
                ],
              }),
            txHash &&
              txStatus === '' &&
              /* @__PURE__ */ jsx39('div', {
                className: 'text-sm text-textSecondary',
                children: 'Waiting for the transaction to be mined',
              }),
          ],
        }),
        /* @__PURE__ */ jsx39('div', { className: 'h-[1px] w-full bg-cardBorder' }),
        txHash &&
          /* @__PURE__ */ jsx39('a', {
            className: 'flex justify-end items-center text-secondary text-sm gap-1',
            href: `${NetworkInfo[chainId].scanLink}/tx/${txHash}`,
            target: '_blank',
            rel: 'noopener norefferer',
            children: 'View transaction \u2197',
          }),
        /* @__PURE__ */ jsx39('button', { className: 'ks-primary-btn w-full', onClick: onDismiss, children: 'Close' }),
      ],
    })
  }
  if (txError) {
    return /* @__PURE__ */ jsxs18('div', {
      className: 'mt-4 gap-4 flex flex-col justify-center items-center text-base font-medium',
      children: [
        /* @__PURE__ */ jsxs18('div', {
          className: 'min-h-[300px] flex justify-center items-center gap-3 flex-col flex-1',
          children: [
            /* @__PURE__ */ jsx39(error_default, { className: 'text-error' }),
            /* @__PURE__ */ jsx39('div', { children: friendlyError(txError) }),
          ],
        }),
        /* @__PURE__ */ jsxs18('div', {
          className: 'w-full',
          children: [
            /* @__PURE__ */ jsx39('div', { className: 'h-[1px] w-full bg-cardBorder' }),
            /* @__PURE__ */ jsxs18('div', {
              className: 'flex justify-between items-center py-[10px] cursor-pointer w-full',
              role: 'button',
              onClick: () => setShowErrorDetail((prev) => !prev),
              children: [
                /* @__PURE__ */ jsxs18('div', {
                  className: 'flex items-center gap-1 text-sm',
                  children: [/* @__PURE__ */ jsx39(info_default, {}), 'Error details'],
                }),
                /* @__PURE__ */ jsx39(dropdown_default, {
                  className: `transition-all duration-200 ease-in-out ${!showErrorDetail ? 'rotate-0' : '-rotate-180'}`,
                }),
              ],
            }),
            /* @__PURE__ */ jsx39('div', { className: 'h-[1px] w-full bg-cardBorder' }),
            /* @__PURE__ */ jsx39('div', {
              className: `ks-error-msg ${showErrorDetail ? 'mt-3 max-h-[200px]' : ''}`,
              children: txError?.message || JSON.stringify(txError),
            }),
          ],
        }),
        /* @__PURE__ */ jsx39('button', {
          className: 'ks-primary-btn w-full',
          onClick: onDismiss,
          children: txError ? 'Dismiss' : 'Close',
        }),
      ],
    })
  }
  const isOutOfRange = position
    ? pool.tickCurrent < position.tickLower || pool.tickCurrent >= position.tickUpper
    : false
  const logo = getDexLogo()
  const name = getDexName()
  const fee = pool.fee
  const piVeryHigh = zapInfo && ['VERY_HIGH' /* VERY_HIGH */, 'INVALID' /* INVALID */].includes(piRes.level)
  const piHigh = zapInfo && piRes.level === 'HIGH' /* HIGH */
  return /* @__PURE__ */ jsxs18('div', {
    className: 'mt-2',
    children: [
      /* @__PURE__ */ jsxs18('div', {
        className: 'flex items-center gap-3',
        children: [
          /* @__PURE__ */ jsxs18('div', {
            className: 'relative w-12 h-12',
            children: [
              /* @__PURE__ */ jsx39('img', {
                className: 'absolute w-7 h-7 top-0 left-0 rounded-[50%]',
                src: token0.logoURI,
                alt: '',
                onError: ({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = question_default
                },
              }),
              /* @__PURE__ */ jsx39('img', {
                className: 'absolute w-9 h-9 bottom-0 right-0 rounded-[50%]',
                src: token1.logoURI,
                alt: '',
                onError: ({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = question_default
                },
              }),
              /* @__PURE__ */ jsx39('div', {
                className:
                  'absolute w-4 h-4 bg-[#1e1e1e] rounded-[5px] flex justify-center items-center bottom-0 right-0',
                children: /* @__PURE__ */ jsx39('img', { src: NetworkInfo[chainId].logo, className: 'w-3 h-3' }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxs18('div', {
            children: [
              /* @__PURE__ */ jsxs18('span', {
                className: 'text-2xl font-semibold flex items-center gap-1',
                children: [
                  token0.symbol,
                  ' ',
                  /* @__PURE__ */ jsx39('span', { className: 'text-textSecondary', children: '/' }),
                  ' ',
                  token1.symbol,
                  positionId &&
                    /* @__PURE__ */ jsxs18('span', {
                      className: 'text-xl text-textSecondary',
                      children: ['#', positionId],
                    }),
                ],
              }),
              /* @__PURE__ */ jsxs18('div', {
                className: 'flex gap-2',
                children: [
                  positionId &&
                    (!isOutOfRange
                      ? /* @__PURE__ */ jsx39('div', {
                          className:
                            'rounded-full py-0 px-2 h-6 text-sm flex items-center gap-1 box-border border border-green20 text-green50 bg-green10',
                          children: 'Active',
                        })
                      : /* @__PURE__ */ jsx39('div', {
                          className:
                            'rounded-full py-0 px-2 h-6 text-sm flex items-center gap-1 box-border border border-warningBorder text-warning bg-warningBackground',
                          children: 'Inactive',
                        })),
                  /* @__PURE__ */ jsxs18('div', {
                    className:
                      'rounded-full py-0 px-2 h-6 bg-tertiary text-textSecondary text-sm flex items-center gap-1 box-border',
                    children: [
                      /* @__PURE__ */ jsx39('img', {
                        src: logo,
                        width: 16,
                        height: 16,
                        alt: '',
                        onError: ({ currentTarget }) => {
                          currentTarget.onerror = null
                          currentTarget.src = question_default
                        },
                      }),
                      /* @__PURE__ */ jsx39('span', { children: name }),
                      /* @__PURE__ */ jsx39('span', { children: '|' }),
                      'Fee ',
                      fee / BASE_BPS,
                      '%',
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxs18('div', {
        className: 'ks-lw-card mt-4 border border-inputBorder bg-inputBackground',
        children: [
          /* @__PURE__ */ jsx39('div', { children: 'Zap-in Amount' }),
          tokensIn.map((token, index) =>
            /* @__PURE__ */ jsxs18(
              'div',
              {
                className: 'flex items-center gap-3 text-sm text-textSecondary mt-2',
                children: [
                  /* @__PURE__ */ jsx39('img', {
                    src: token.logoURI,
                    className: 'w-[18px] h-[18px]',
                    onError: ({ currentTarget }) => {
                      currentTarget.onerror = null
                      currentTarget.src = question_default
                    },
                  }),
                  /* @__PURE__ */ jsxs18('div', {
                    className: 'text-textPrimary text-base',
                    children: [
                      formatNumber(+listAmountsIn[index]),
                      ' ',
                      token.symbol,
                      /* @__PURE__ */ jsx39('span', {
                        className: 'text-textSecondary font-normal text-sm ml-2',
                        children: formatCurrency((token.price || 0) * parseFloat(listAmountsIn[index])),
                      }),
                    ],
                  }),
                ],
              },
              index,
            ),
          ),
        ],
      }),
      /* @__PURE__ */ jsxs18('div', {
        className: 'ks-lw-card mt-3 text-sm',
        children: [
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex items-center gap-1 text-sm text-textSecondary',
            children: [
              /* @__PURE__ */ jsx39('div', { children: 'Current pool price' }),
              /* @__PURE__ */ jsx39('span', { className: 'text-textPrimary', children: price }),
              quote,
              /* @__PURE__ */ jsx39(switch_default, {
                className: 'cursor-pointer',
                onClick: () => toggleRevertPrice(),
                role: 'button',
              }),
            ],
          }),
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between items-center gap-4 w-full mt-2',
            children: [
              /* @__PURE__ */ jsxs18('div', {
                className:
                  'flex-1 w-1/2 bg-inputBackground border border-inputBorder p-3 rounded-md flex flex-col gap-1 items-center',
                children: [
                  /* @__PURE__ */ jsx39('div', {
                    className: 'font-semibold text-xs text-secondary',
                    children: 'MIN PRICE',
                  }),
                  /* @__PURE__ */ jsx39('div', {
                    className:
                      'w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-base font-semibold',
                    children: (revert ? tickUpper === pool.maxTick : tickLower === pool.minTick)
                      ? '0'
                      : leftPrice?.toSignificant(6),
                  }),
                  /* @__PURE__ */ jsx39('div', { className: 'text-textSecondary', children: quote }),
                ],
              }),
              /* @__PURE__ */ jsxs18('div', {
                className:
                  'flex-1 w-1/2 bg-inputBackground border border-inputBorder p-3 rounded-md flex flex-col gap-1 items-center',
                children: [
                  /* @__PURE__ */ jsx39('div', {
                    className: 'font-semibold text-xs text-secondary',
                    children: 'MAX PRICE',
                  }),
                  /* @__PURE__ */ jsx39('div', {
                    className:
                      'text-center w-full overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold',
                    children: (!revert ? tickUpper === pool.maxTick : tickLower === pool.minTick)
                      ? '\u221E'
                      : rightPrice?.toSignificant(6),
                  }),
                  /* @__PURE__ */ jsx39('div', { className: 'text-textSecondary', children: quote }),
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxs18('div', {
        className: 'ks-lw-card flex flex-col gap-3 mt-3',
        children: [
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between gap-4 w-full items-start',
            children: [
              /* @__PURE__ */ jsxs18('div', {
                className: 'text-sm font-medium text-textSecondary',
                children: ['Est. Pooled ', pool.token0.symbol],
              }),
              /* @__PURE__ */ jsxs18('div', {
                children: [
                  /* @__PURE__ */ jsxs18('div', {
                    className: 'flex gap-1',
                    children: [
                      token0?.logoURI &&
                        /* @__PURE__ */ jsx39('img', {
                          className: 'w-4 h-4 rounded-full mt-1',
                          src: token0.logoURI,
                          onError: ({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = question_default
                          },
                        }),
                      /* @__PURE__ */ jsx39('div', {
                        children: position
                          ? /* @__PURE__ */ jsxs18('div', {
                              className: 'text-end',
                              children: [formatNumber(+position.amount0.toExact(), 4), ' ', pool?.token0.symbol],
                            })
                          : /* @__PURE__ */ jsxs18('div', {
                              className: 'text-end',
                              children: [formatNumber(+addedAmount0, 4), ' ', pool?.token0.symbol],
                            }),
                      }),
                    ],
                  }),
                  position &&
                    /* @__PURE__ */ jsxs18('div', {
                      className: 'text-end',
                      children: ['+ ', formatNumber(+addedAmount0, 4), ' ', pool?.token0.symbol],
                    }),
                  /* @__PURE__ */ jsxs18('div', {
                    className: 'ml-auto w-fit text-textSecondary',
                    children: [
                      '~',
                      formatCurrency(+(addedLiqInfo?.addLiquidity.token0.amountUsd || 0) + positionAmount0Usd),
                    ],
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between gap-4 w-full items-start',
            children: [
              /* @__PURE__ */ jsxs18('div', {
                className: 'text-sm font-medium text-textSecondary',
                children: ['Est. Pooled ', pool.token1.symbol],
              }),
              /* @__PURE__ */ jsxs18('div', {
                children: [
                  /* @__PURE__ */ jsxs18('div', {
                    className: 'flex gap-1 justify-end',
                    children: [
                      token1?.logoURI &&
                        /* @__PURE__ */ jsx39('img', {
                          src: token1.logoURI,
                          className: 'w-4 h-4 rounded-full mt-1',
                          onError: ({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = question_default
                          },
                        }),
                      position
                        ? /* @__PURE__ */ jsxs18('div', {
                            className: 'text-end',
                            children: [formatNumber(+position.amount1.toExact(), 4), ' ', pool?.token1.symbol],
                          })
                        : /* @__PURE__ */ jsxs18('div', {
                            className: 'text-end',
                            children: [formatNumber(+addedAmount1, 4), ' ', pool?.token1.symbol],
                          }),
                    ],
                  }),
                  position &&
                    /* @__PURE__ */ jsxs18('div', {
                      className: 'text-end',
                      children: ['+ ', formatNumber(+addedAmount1, 4), ' ', pool?.token1.symbol],
                    }),
                  /* @__PURE__ */ jsxs18('div', {
                    className: 'ml-auto w-fit text-textSecondary',
                    children: [
                      '~',
                      formatCurrency(+(addedLiqInfo?.addLiquidity.token1.amountUsd || 0) + positionAmount1Usd),
                    ],
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between items-center gap-4 w-full',
            children: [
              /* @__PURE__ */ jsx39(MouseoverTooltip, {
                text: 'Based on your price range settings, a portion of your liquidity will be automatically zapped into the pool, while the remaining amount will stay in your wallet.',
                width: '220px',
                children: /* @__PURE__ */ jsx39('div', {
                  className: 'text-sm font-medium text-textSecondary border-b border-dotted border-textSecondary',
                  children: 'Est. Remaining Value',
                }),
              }),
              /* @__PURE__ */ jsxs18('span', {
                className: 'text-sm font-medium',
                children: [
                  formatCurrency(refundUsd),
                  /* @__PURE__ */ jsx39(InfoHelper, {
                    text: /* @__PURE__ */ jsxs18('div', {
                      children: [
                        /* @__PURE__ */ jsxs18('div', { children: [refundAmount0, ' ', pool.token0.symbol, ' '] }),
                        /* @__PURE__ */ jsxs18('div', { children: [refundAmount1, ' ', pool.token1.symbol] }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between items-center gap-4 w-full',
            children: [
              /* @__PURE__ */ jsx39(MouseoverTooltip, {
                text: 'Applied to each zap step. Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Please use with caution!',
                width: '220px',
                children: /* @__PURE__ */ jsx39('div', {
                  className: 'text-sm font-medium text-textSecondary border-b border-dotted border-textSecondary',
                  children: 'Max Slippage',
                }),
              }),
              /* @__PURE__ */ jsxs18('span', {
                className: `text-sm font-medium ${slippage > warningThreshold ? 'text-warning' : 'text-textPrimary'}`,
                children: [((slippage * 100) / 1e4).toFixed(2), '%'],
              }),
            ],
          }),
          /* @__PURE__ */ jsx39('div', {
            className: 'flex justify-between items-center gap-4 w-full',
            children: swapPi.length
              ? /* @__PURE__ */ jsx39(Accordion2, {
                  type: 'single',
                  collapsible: true,
                  className: 'w-full',
                  children: /* @__PURE__ */ jsxs18(AccordionItem2, {
                    value: 'item-1',
                    children: [
                      /* @__PURE__ */ jsx39(AccordionTrigger2, {
                        className: 'transition-all [&[data-state=open]>svg]:rotate-180',
                        children: /* @__PURE__ */ jsx39(MouseoverTooltip, {
                          text: 'View all the detailed estimated price impact of each swap',
                          width: '220px',
                          children: /* @__PURE__ */ jsx39('div', {
                            className: `text-textSecondary w-fit text-sm font-normal normal-case border-b border-dotted border-textSecondary ${
                              swapPiRes.piRes.level === 'NORMAL' /* NORMAL */
                                ? ''
                                : swapPiRes.piRes.level === 'HIGH' /* HIGH */
                                ? '!text-warning !border-warning'
                                : '!text-error !border-error'
                            }`,
                            children: 'Swap Impact',
                          }),
                        }),
                      }),
                      /* @__PURE__ */ jsx39(AccordionContent2, {
                        className: 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
                        children: swapPi.map((item, index) =>
                          /* @__PURE__ */ jsxs18(
                            'div',
                            {
                              className: `text-xs flex justify-between align-middle text-textSecondary mt-1 ${
                                index === 0 ? 'mt-2' : ''
                              } ${
                                item.piRes.level === 'NORMAL' /* NORMAL */
                                  ? 'brightness-125'
                                  : item.piRes.level === 'HIGH' /* HIGH */
                                  ? '!text-warning'
                                  : '!text-error'
                              }`,
                              children: [
                                /* @__PURE__ */ jsxs18('div', {
                                  className: 'ml-3',
                                  children: [
                                    item.amountIn,
                                    ' ',
                                    item.tokenInSymbol,
                                    ' ',
                                    '\u2192 ',
                                    item.amountOut,
                                    ' ',
                                    item.tokenOutSymbol,
                                  ],
                                }),
                                /* @__PURE__ */ jsx39('div', { children: item.piRes.display }),
                              ],
                            },
                            index,
                          ),
                        ),
                      }),
                    ],
                  }),
                })
              : /* @__PURE__ */ jsxs18(Fragment12, {
                  children: [
                    /* @__PURE__ */ jsx39(MouseoverTooltip, {
                      text: 'Estimated change in price due to the size of your transaction. Applied to the Swap steps.',
                      width: '220px',
                      children: /* @__PURE__ */ jsx39('div', {
                        className:
                          'text-textSecondary w-fit text-sm font-normal normal-case border-b border-dotted border-textSecondary',
                        children: 'Swap Impact',
                      }),
                    }),
                    /* @__PURE__ */ jsx39('span', { children: '--' }),
                  ],
                }),
          }),
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between items-center gap-4 w-full',
            children: [
              /* @__PURE__ */ jsx39(MouseoverTooltip, {
                text: 'The difference between input and estimated liquidity received (including remaining amount). Be careful with high value!',
                width: '220px',
                children: /* @__PURE__ */ jsx39('div', {
                  className: 'text-sm font-medium text-textSecondary border-b border-dotted border-textSecondary',
                  children: 'Zap impact',
                }),
              }),
              zapInfo
                ? /* @__PURE__ */ jsx39('div', {
                    className:
                      piRes.level === 'VERY_HIGH' /* VERY_HIGH */ || piRes.level === 'INVALID' /* INVALID */
                        ? 'text-error'
                        : piRes.level === 'HIGH' /* HIGH */
                        ? 'text-warning'
                        : 'text-textPrimary',
                    children: piRes.display,
                  })
                : '--',
            ],
          }),
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between items-center gap-4 w-full',
            children: [
              /* @__PURE__ */ jsx39(MouseoverTooltip, {
                text: 'Estimated network fee for your transaction.',
                width: '220px',
                children: /* @__PURE__ */ jsx39('div', {
                  className: 'text-sm font-medium text-textSecondary border-b border-dotted border-textSecondary',
                  children: 'Est. Gas Fee',
                }),
              }),
              gasUsd ? formatCurrency(gasUsd) : '--',
            ],
          }),
          /* @__PURE__ */ jsxs18('div', {
            className: 'flex justify-between items-center gap-4 w-full',
            children: [
              /* @__PURE__ */ jsx39(MouseoverTooltip, {
                text: /* @__PURE__ */ jsxs18('div', {
                  children: [
                    'Fees charged for automatically zapping into a liquidity pool. You still have to pay the standard gas fees.',
                    ' ',
                    /* @__PURE__ */ jsx39('a', {
                      className: 'text-primary',
                      href: 'https://docs.kyberswap.com/kyberswap-solutions/kyberswap-zap-as-a-service/zap-fee-model',
                      target: '_blank',
                      rel: 'noopener norefferer',
                      children: 'More details.',
                    }),
                  ],
                }),
                width: '220px',
                children: /* @__PURE__ */ jsx39('div', {
                  className: 'text-sm font-medium text-textSecondary border-b border-dotted border-textSecondary',
                  children: 'Zap Fee',
                }),
              }),
              /* @__PURE__ */ jsxs18(MouseoverTooltip, {
                text: partnerFee
                  ? `${parseFloat(protocolFee.toFixed(3))}% Protocol Fee + ${parseFloat(
                      partnerFee.toFixed(3),
                    )}% Fee for ${source}`
                  : '',
                children: [
                  /* @__PURE__ */ jsx39('div', {
                    className: 'border-b border-dotted border-textSecondary',
                    children: feeInfo || partnerFee ? parseFloat((protocolFee + partnerFee).toFixed(3)) + '%' : '--',
                  }),
                  ' ',
                ],
              }),
            ],
          }),
        ],
      }),
      slippage > warningThreshold &&
        /* @__PURE__ */ jsx39('div', {
          className: 'ks-lw-card-warning mt-3',
          children: 'Slippage is high, your transaction might be front-run!',
        }),
      aggregatorSwapInfo &&
        swapPiRes.piRes.level !== 'NORMAL' /* NORMAL */ &&
        /* @__PURE__ */ jsx39('div', { className: 'ks-lw-card-warning mt-3', children: swapPiRes.piRes.msg }),
      zapInfo &&
        piRes.level !== 'NORMAL' /* NORMAL */ &&
        /* @__PURE__ */ jsx39('div', { className: 'ks-lw-card-warning mt-3', children: piRes.msg }),
      /* @__PURE__ */ jsxs18('button', {
        className: `ks-primary-btn mt-4 w-full ${piVeryHigh ? 'bg-error' : piHigh ? 'bg-warning' : ''} ${
          piVeryHigh ? 'border border-error' : piHigh ? 'border border-warning' : ''
        }`,
        onClick: handleClick,
        children: [positionId ? 'Increase' : 'Add', ' Liquidity'],
      }),
    ],
  })
}

// src/components/Content/index.tsx
import { nearestUsableTick as nearestUsableTick4 } from '@pancakeswap/v3-sdk'
import { Fragment as Fragment13, jsx as jsx40, jsxs as jsxs19 } from 'react/jsx-runtime'
function Content3({ onDismiss, onTogglePreview, onTxSubmit }) {
  const {
    tokensIn,
    amountsIn,
    zapInfo,
    error,
    priceLower,
    priceUpper,
    ttl,
    loading: zapLoading,
    setTick,
    tickLower,
    tickUpper,
    slippage,
    positionId,
    degenMode,
    revertPrice,
  } = useZapState()
  const { pool, theme, error: loadPoolError, onConnectWallet, onOpenTokenSelectModal } = useWidgetInfo()
  const { account } = useWeb3Provider()
  const [clickedApprove, setClickedLoading] = useState20(false)
  const [snapshotState, setSnapshotState] = useState20(null)
  const amountsInWei = useMemo12(
    () =>
      !amountsIn
        ? []
        : amountsIn.split(',').map((amount, index) => parseUnits2(amount || '0', tokensIn[index]?.decimals).toString()),
    [tokensIn, amountsIn],
  )
  const { loading, approvalStates, addressToApprove, approve } = useApprovals(
    amountsInWei,
    tokensIn.map((token) => token?.address || ''),
    zapInfo?.routerAddress || '',
  )
  const notApprove = useMemo12(
    () => tokensIn.find((item) => approvalStates[item?.address || ''] === 'not_approved' /* NOT_APPROVED */),
    [approvalStates, tokensIn],
  )
  const pi = useMemo12(() => {
    const aggregatorSwapInfo = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_AGGREGATOR_SWAP' /* AGGREGATOR_SWAP */,
    )
    const poolSwapInfo = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_POOL_SWAP' /* POOL_SWAP */,
    )
    const feeInfo = zapInfo?.zapDetails.actions.find(
      (item) => item.type === 'ACTION_TYPE_PROTOCOL_FEE' /* PROTOCOL_FEE */,
    )
    const piRes = getPriceImpact(zapInfo?.zapDetails.priceImpact, 'Zap' /* ZAP */, feeInfo)
    const aggregatorSwapPi =
      aggregatorSwapInfo?.aggregatorSwap?.swaps?.map((item) => {
        const pi2 =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        return getPriceImpact(pi2, 'Swap price' /* SWAP */, feeInfo)
      }) || []
    const poolSwapPi =
      poolSwapInfo?.poolSwap?.swaps?.map((item) => {
        const pi2 =
          ((parseFloat(item.tokenIn.amountUsd) - parseFloat(item.tokenOut.amountUsd)) /
            parseFloat(item.tokenIn.amountUsd)) *
          100
        return getPriceImpact(pi2, 'Swap price' /* SWAP */, feeInfo)
      }) || []
    const swapPiHigh = !!aggregatorSwapPi.concat(poolSwapPi).find((item) => item.level === 'HIGH' /* HIGH */)
    const swapPiVeryHigh = !!aggregatorSwapPi
      .concat(poolSwapPi)
      .find((item) => item.level === 'VERY_HIGH' /* VERY_HIGH */)
    const piVeryHigh =
      (zapInfo && ['VERY_HIGH' /* VERY_HIGH */, 'INVALID' /* INVALID */].includes(piRes.level)) || swapPiVeryHigh
    const piHigh = (zapInfo && piRes.level === 'HIGH') /* HIGH */ || swapPiHigh
    return { piVeryHigh, piHigh }
  }, [zapInfo])
  const btnText = useMemo12(() => {
    if (error) return error
    if (zapLoading) return 'Loading...'
    if (loading) return 'Checking Allowance'
    if (addressToApprove) return 'Approving'
    if (notApprove) return `Approve ${notApprove.symbol}`
    if (pi.piVeryHigh) return 'Zap anyway'
    return 'Preview'
  }, [addressToApprove, error, loading, notApprove, pi, zapLoading])
  const disabled = useMemo12(
    () =>
      clickedApprove ||
      loading ||
      zapLoading ||
      !!error ||
      Object.values(approvalStates).some((item) => item === 'pending' /* PENDING */) ||
      (pi.piVeryHigh && !degenMode),
    [approvalStates, clickedApprove, degenMode, error, loading, pi.piVeryHigh, zapLoading],
  )
  const hanldeClick = () => {
    if (notApprove) {
      setClickedLoading(true)
      approve(notApprove.address).finally(() => setClickedLoading(false))
    } else if (
      pool &&
      amountsIn &&
      tokensIn.every(Boolean) &&
      zapInfo &&
      priceLower &&
      priceUpper &&
      tickLower !== null &&
      tickUpper !== null
    ) {
      const date = /* @__PURE__ */ new Date()
      date.setMinutes(date.getMinutes() + (ttl || 20))
      setSnapshotState({
        tokensIn,
        amountsIn,
        pool,
        zapInfo,
        priceLower,
        priceUpper,
        deadline: Math.floor(date.getTime() / 1e3),
        isFullRange: pool.maxTick === tickUpper && pool.minTick === tickLower,
        slippage,
        tickUpper,
        tickLower,
      })
      onTogglePreview?.(true)
    }
  }
  useEffect18(() => {
    if (snapshotState === null) {
      onTogglePreview?.(false)
    }
  }, [snapshotState, onTogglePreview])
  const correctPrice = useCallback13(
    (value, type) => {
      if (!pool) return
      if (revertPrice) {
        const defaultTick = (type === 'PriceLower' /* PriceLower */ ? tickLower : tickUpper) || pool?.tickCurrent
        const tick = tryParseTick(pool?.token1, pool?.token0, pool?.fee, value) ?? defaultTick
        if (Number.isInteger(tick)) setTick(type, nearestUsableTick4(tick, pool.tickSpacing))
      } else {
        const defaultTick = (type === 'PriceLower' /* PriceLower */ ? tickLower : tickUpper) || pool?.tickCurrent
        const tick = tryParseTick(pool?.token0, pool?.token1, pool?.fee, value) ?? defaultTick
        if (Number.isInteger(tick)) setTick(type, nearestUsableTick4(tick, pool.tickSpacing))
      }
    },
    [pool, revertPrice, tickLower, tickUpper, setTick],
  )
  const currentPoolPrice = pool ? (revertPrice ? pool.priceOf(pool.token1) : pool.priceOf(pool.token0)) : void 0
  const selectPriceRange = useCallback13(
    (percent) => {
      if (!currentPoolPrice) return
      const left = +currentPoolPrice.toSignificant(18) * (1 - percent)
      const right = +currentPoolPrice.toSignificant(18) * (1 + percent)
      correctPrice(left.toString(), 'PriceLower' /* PriceLower */)
      correctPrice(right.toString(), 'PriceUpper' /* PriceUpper */)
    },
    [correctPrice, currentPoolPrice],
  )
  useEffect18(() => {
    if (!tickLower && !tickUpper && pool) selectPriceRange(0.2)
  }, [pool, selectPriceRange, tickLower, tickUpper])
  return /* @__PURE__ */ jsxs19(Fragment13, {
    children: [
      loadPoolError &&
        /* @__PURE__ */ jsx40(Modal_default, {
          isOpen: true,
          onClick: () => onDismiss(),
          children: /* @__PURE__ */ jsxs19('div', {
            className: 'flex flex-col items-center gap-8 text-error',
            children: [
              /* @__PURE__ */ jsx40(error_default, {}),
              /* @__PURE__ */ jsx40('div', { className: 'text-center', children: loadPoolError }),
              /* @__PURE__ */ jsx40('button', {
                className: 'ks-primary-btn w-[95%] bg-error border border-error',
                onClick: onDismiss,
                children: 'Close',
              }),
            ],
          }),
        }),
      snapshotState &&
        /* @__PURE__ */ jsxs19(Modal_default, {
          isOpen: true,
          onClick: () => setSnapshotState(null),
          children: [
            /* @__PURE__ */ jsxs19('div', {
              className: 'flex justify-between text-xl font-medium',
              children: [
                /* @__PURE__ */ jsxs19('div', { children: [positionId ? 'Increase' : 'Add', ' Liquidity via Zap'] }),
                /* @__PURE__ */ jsx40('div', {
                  className: 'cursor-pointer',
                  role: 'button',
                  onClick: () => setSnapshotState(null),
                  children: /* @__PURE__ */ jsx40(x_default, {}),
                }),
              ],
            }),
            /* @__PURE__ */ jsx40(Preview, {
              onTxSubmit,
              zapState: snapshotState,
              onDismiss: () => {
                setSnapshotState(null)
              },
            }),
          ],
        }),
      /* @__PURE__ */ jsx40(Header_default, { onDismiss }),
      /* @__PURE__ */ jsxs19('div', {
        className: 'flex gap-5 py-0 px-6 max-sm:flex-col',
        children: [
          /* @__PURE__ */ jsxs19('div', {
            className: 'flex-1 w-1/2 max-sm:w-full',
            children: [
              /* @__PURE__ */ jsx40('div', {
                className: 'text-xs font-medium text-secondary uppercase mb-4',
                children: 'Deposit Amount',
              }),
              tokensIn.map((_, tokenIndex) => /* @__PURE__ */ jsx40(LiquidityToAdd, { tokenIndex }, tokenIndex)),
              /* @__PURE__ */ jsxs19('div', {
                className: `mt-4 text-primary cursor-pointer w-fit text-sm ${
                  tokensIn.length >= MAX_ZAP_IN_TOKENS ? 'opacity-50' : ''
                }`,
                onClick: () => tokensIn.length < MAX_ZAP_IN_TOKENS && onOpenTokenSelectModal(),
                children: [
                  '+ Add more token',
                  /* @__PURE__ */ jsx40(InfoHelper, {
                    text: `Can zap in with up to ${MAX_ZAP_IN_TOKENS} tokens`,
                    color: theme.primary,
                    style: {
                      verticalAlign: 'baseline',
                      position: 'relative',
                      top: 2,
                      left: 2,
                    },
                  }),
                ],
              }),
              /* @__PURE__ */ jsx40('div', {
                className: 'text-xs font-medium text-secondary uppercase mt-6',
                children: 'Set price ranges',
              }),
              /* @__PURE__ */ jsxs19('div', {
                className: 'ks-lw-card',
                children: [
                  /* @__PURE__ */ jsx40(PriceInfo, {}),
                  /* @__PURE__ */ jsxs19('div', {
                    className: 'grid grid-cols-2 gap-2',
                    children: [
                      /* @__PURE__ */ jsx40(PriceInput, { type: 'PriceLower' /* PriceLower */ }),
                      /* @__PURE__ */ jsx40(PriceInput, { type: 'PriceUpper' /* PriceUpper */ }),
                    ],
                  }),
                  positionId === void 0 &&
                    /* @__PURE__ */ jsxs19('div', {
                      className: 'mt-[10px] w-full flex justify-between gap-2 text-xs',
                      children: [
                        /* @__PURE__ */ jsx40('button', {
                          className: 'ks-outline-btn medium',
                          onClick: () => selectPriceRange(0.1),
                          children: '10%',
                        }),
                        /* @__PURE__ */ jsx40('button', {
                          className: 'ks-outline-btn medium',
                          onClick: () => selectPriceRange(0.2),
                          children: '20%',
                        }),
                        /* @__PURE__ */ jsx40('button', {
                          className: 'ks-outline-btn medium',
                          onClick: () => selectPriceRange(0.75),
                          children: '75%',
                        }),
                        /* @__PURE__ */ jsx40('button', {
                          className: 'ks-outline-btn medium',
                          onClick: () => {
                            if (!pool) return
                            setTick('PriceLower' /* PriceLower */, revertPrice ? pool.maxTick : pool.minTick)
                            setTick('PriceUpper' /* PriceUpper */, revertPrice ? pool.minTick : pool.maxTick)
                          },
                          children: 'Full range',
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxs19('div', {
            className: 'flex-1 w-1/2 max-sm:w-full',
            children: [/* @__PURE__ */ jsx40(ZapRoute, {}), /* @__PURE__ */ jsx40(EstLiqValue, {})],
          }),
        ],
      }),
      /* @__PURE__ */ jsxs19('div', {
        className: 'flex gap-6 p-6',
        children: [
          /* @__PURE__ */ jsx40('button', {
            className: 'ks-outline-btn flex-1',
            onClick: onDismiss,
            children: 'Cancel',
          }),
          !account
            ? /* @__PURE__ */ jsx40('button', {
                className: 'ks-primary-btn flex-1',
                onClick: onConnectWallet,
                children: 'Connect Wallet',
              })
            : /* @__PURE__ */ jsxs19('button', {
                className: 'ks-primary-btn flex-1',
                disabled,
                onClick: hanldeClick,
                style:
                  !disabled && Object.values(approvalStates).some((item) => item !== 'not_approved' /* NOT_APPROVED */)
                    ? {
                        background: pi.piVeryHigh && degenMode ? theme.error : pi.piHigh ? theme.warning : void 0,
                        border:
                          pi.piVeryHigh && degenMode ? `1px solid ${theme.error}` : pi.piHigh ? theme.warning : void 0,
                        color: pi.piVeryHigh && degenMode ? 'fff' : void 0,
                      }
                    : {},
                children: [
                  btnText,
                  pi.piVeryHigh &&
                    !error &&
                    /* @__PURE__ */ jsx40(InfoHelper, {
                      width: '300px',
                      color: theme.textReverse,
                      text: degenMode
                        ? 'You have turned on Degen Mode from settings. Trades with very high price impact can be executed'
                        : 'To ensure you dont lose funds due to very high price impact (\u226510%), swap has been disabled for this trade. If you still wish to continue, you can turn on Degen Mode from Settings.',
                    }),
                ],
              }),
        ],
      }),
    ],
  })
}

// src/components/Widget/index.tsx
import { jsx as jsx41, jsxs as jsxs20 } from 'react/jsx-runtime'
var getChainById = (chainId) => {
  return Object.values(chains).find((chain) => chain.id === chainId)
}
function Widget({
  theme: themeProps,
  walletClient,
  account,
  chainId,
  networkChainId,
  initTickLower,
  initTickUpper,
  poolAddress,
  positionId,
  feeAddress,
  feePcm,
  includedSources,
  excludedSources,
  source,
  initDepositTokens,
  initAmounts,
  onDismiss,
  onTxSubmit,
  onConnectWallet,
  onAddTokens,
  onRemoveToken,
  onAmountChange,
  onOpenTokenSelectModal,
  farmContractAddresses = [],
}) {
  const publicClient = useMemo13(() => {
    const chain = getChainById(chainId)
    if (!chain) {
      throw new Error(`chainId: ${chainId} is not supported`)
    }
    return createPublicClient({
      chain,
      transport: http(NetworkInfo[chainId].defaultRpc),
    })
  }, [chainId])
  const theme = useMemo13(() => {
    if (themeProps === 'light') return lightTheme
    return defaultTheme
  }, [themeProps])
  useEffect19(() => {
    if (!theme) return
    const r2 = document.querySelector(':root')
    Object.keys(theme).forEach((key) => {
      r2?.style.setProperty(`--ks-lw-${key}`, theme[key])
    })
  }, [theme])
  useEffect19(() => {
    const createModalRoot = () => {
      let modalRoot = document.getElementById('ks-lw-modal-root')
      if (!modalRoot) {
        modalRoot = document.createElement('div')
        modalRoot.id = 'ks-lw-modal-root'
        modalRoot.className = 'ks-lw-style'
        document.body.appendChild(modalRoot)
      }
    }
    createModalRoot()
  }, [])
  return /* @__PURE__ */ jsx41(Web3Provider, {
    walletClient,
    publicClient,
    chainId,
    account,
    networkChainId,
    children: /* @__PURE__ */ jsx41(TokenProvider, {
      children: /* @__PURE__ */ jsx41(WidgetProvider, {
        poolAddress,
        positionId: positionId === '' || !parseInt(positionId || '') ? void 0 : positionId,
        theme: theme || defaultTheme,
        feeAddress,
        feePcm,
        onConnectWallet,
        onAddTokens,
        onRemoveToken,
        onAmountChange,
        onOpenTokenSelectModal,
        farmContractAddresses,
        children: /* @__PURE__ */ jsx41(ZapContextProvider, {
          includedSources,
          excludedSources,
          initTickUpper,
          initTickLower,
          source,
          initDepositTokens,
          initAmounts,
          children: /* @__PURE__ */ jsxs20('div', {
            className: 'ks-lw ks-lw-style',
            children: [/* @__PURE__ */ jsx41(Content3, { onDismiss, onTxSubmit }), /* @__PURE__ */ jsx41(Setting, {})],
          }),
        }),
      }),
    }),
  })
}
export { Widget as LiquidityWidget }
//# sourceMappingURL=liquidity-widget.js.map
