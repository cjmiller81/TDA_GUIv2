import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import { CustomThemeContext } from '@/themes/CustomThemeContext'
import LightModeIcon from '@mui/icons-material/LightMode'
import NightlightRoundIcon from '@mui/icons-material/NightlightRound'
function Header() {
  const colorMode = React.useContext(CustomThemeContext)

  return (
    <IconButton color="inherit" onClick={colorMode.toggle}>
      {colorMode.currentTheme === 'dark' ? (
        <LightModeIcon />
      ) : (
        <NightlightRoundIcon stroke="black" />
      )}
    </IconButton>
  )
}

export default Header
