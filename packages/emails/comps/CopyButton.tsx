import { Button } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value.toString());
}

export const CopyButton = ({value}) => {
    const handleClick = () => {
        copyToClipboard(value)
    }
    return <Button onClick={handleClick}><ContentCopyIcon>Copy</ContentCopyIcon></Button>
}
