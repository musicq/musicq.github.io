import Typography from 'typography'
import githubTypoGraphy from './typography-github'

const typography = new Typography(githubTypoGraphy)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
