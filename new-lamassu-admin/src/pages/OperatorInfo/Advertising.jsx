import React, { useState } from 'react'
import { Switch, TextField, IconButton, Button } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { global } from './OperatorInfo.styles'

const GET_CONFIG = gql`
  query getData {
    config
  }
`

const SAVE_CONFIG = gql`
  mutation Save($config: JSONObject) {
    saveConfig(config: $config)
  }
`

const Advertising = () => {
  const [isAdvertisingEnabled, setIsAdvertisingEnabled] = useState(false)
  const [adUrls, setAdUrls] = useState([])
  const [newAdUrl, setNewAdUrl] = useState('')
  const [error, setError] = useState('')
  const { data } = useQuery(GET_CONFIG)
  const [saveConfig] = useMutation(SAVE_CONFIG, {
    refetchQueries: () => ['getData']
  })

  if (!!data.AdPlaylist) {
    setIsAdvertisingEnabled(true)
    data.AdPlaylist.forEach(element => {
      setAdUrls(element)
    });
  }
  
  const handleAddAd = () => {
    if (newAdUrl.trim() && newAdUrl.startsWith('https://www.dropbox.com/scl/fi/')) {
      setAdUrls([...adUrls, {src: newAdUrl}])
      setNewAdUrl('')
      setError('')
    } else {
      setError('Must start with https://www.dropbox.com/scl/fi/')
    }
  }

  const handleRemoveAd = (index) => {
    const newUrls = [...adUrls]
    newUrls.splice(index, 1)
    setAdUrls(newUrls)
    saveConfig({variables: { config: toNamespace(namespaces.ADVERTISING, adUrls) }})
  }

  const handleAdUrlChange = (event) => {
    setNewAdUrl(event.target.value)
    saveConfig({variables: { config: toNamespace(namespaces.ADVERTISING, adUrls) }})
  }

  return (
    <div style={global.section}>
      <div style={global.switchRow}>
        <div>
          <span>Enable Advertising</span>
        </div>
        <div style={global.switch}>
          <Switch
            checked={isAdvertisingEnabled}
            onChange={(e) => {
              setIsAdvertisingEnabled(e.target.checked)
              setAdUrls([])
            }}
          />
        </div>
      </div>

      {isAdvertisingEnabled && (
        <div>
          <div style={{ ...global.row, width: '100%' }}>
            <TextField
              fullWidth
              label="Add dropbox Ad URL (must start with https://www.dropbox.com/scl/fi/)"
              value={newAdUrl}
              onChange={handleAdUrlChange}
              error={!!error}
              helperText={error}
              style={{ marginRight: 16 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddAd}>Add</Button>
          </div>

          {adUrls.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {adUrls.map((url, index) => (
                <div
                  key={index}
                  style={{ ...global.row, width: '100%', alignItems: 'center', marginBottom: 0 }}
                >
                  <span>{index + 1} : </span>
                  <span style={{ flex: 1 }}>{url}</span>
                  <IconButton onClick={() => handleRemoveAd(index)}>
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Advertising