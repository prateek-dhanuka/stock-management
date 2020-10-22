import React from 'react'
import ValidContext from './ValidContext'
import database from '@react-native-firebase/database'
import { getItemScreenColor } from './utils'

/**
 *
 * @param {String} grade
 * @param {String} shape
 * @param {number} dia
 * @return {Object} Count, Weight and Estimated cost of particular variation
 */
export function getSummary(grade, shape, dia) {
  //TODO: implement database functionality
  const count = Math.round(100 * Math.random())
  return {
    count: count,
    weight: 5 * count,
    cost: 40 * count,
  }
}

export function getCounts(grade, shape, dia, valid) {
  const origins = valid.origins
  const locs = valid.locs

  const output = { full: {}, partial: {} }
  Object.keys(origins).forEach((origin) => {
    output["full"][origin] = {}
    output["partial"][origin] = {}
    Object.keys(locs).forEach((loc) => {
      const full = Math.floor(10 * Math.random())
      const partial = Math.floor(10 * Math.random())
      for (let i = 0; i < partial; ++i) {
        output["partial"][origin][loc] = {
          length: Math.floor(6000 * Math.random()),
          count: Math.floor(10 * Math.random()),
        }
      }

      output["full"][origin][loc] = full
    })
  })

  return output
}

export function getGradeColor(grade, shape, valid) {
  const origins = valid.origins
  const colors = valid.colors

  const output = {}
  Object.keys(origins).forEach((origin) => {
    const keys = Object.keys(colors)
    output[origin] = colors[keys[Math.floor(Math.random() * keys.length)]]
  })

  return output
}
