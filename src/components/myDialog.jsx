import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// ... otros componentes de diálogo

function MyDialog() {
  // ... lógica para manejar el estado del diálogo
  return (
    <div>
      <Button onClick={handleClickOpen}>Abrir diálogo</Button>
      <Dialog open={open} onClose={handleClose}>
        {/* Contenido del diálogo */}
      </Dialog>
    </div>
  );
}