import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog() {
    
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

  return (
    <div>
      <Button onClick={handleClickOpen}>Abrir diálogo</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">

        <DialogTitle id="alert-dialog-title">{"¿Estás seguro?"}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose} autoFocus>Aceptar</Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}