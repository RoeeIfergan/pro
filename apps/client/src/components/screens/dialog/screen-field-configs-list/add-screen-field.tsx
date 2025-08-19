import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { useFields } from '../../../../hooks/fields';
import { useMemo, useState } from 'react';
import { Field } from '@deliveries/entities';

interface ScreensDialogProps {
  existingFieldIds: number[];
  onAdd: (field: Field) => void;
}

export default function AddScreenFieldConfigsListItem(
  props: ScreensDialogProps
) {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const { data: fields } = useFields();

  const handleOnClickAdd = () => {
    if (!selectedField) return;
    props.onAdd(selectedField);
    setSelectedField(null);
  };

  const filteredOptions = useMemo(
    () => fields?.filter(({ id }) => !props.existingFieldIds.includes(id)),
    [fields, props.existingFieldIds]
  );

  if (!filteredOptions) return null;

  return (
    <Stack direction="row" gap={1}>
      <Autocomplete
        fullWidth
        size="small"
        value={selectedField}
        options={filteredOptions}
        onChange={(_, value) => setSelectedField(value)}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} />}
      />
      <Button
        color="secondary"
        variant="outlined"
        size="small"
        disabled={!selectedField}
        onClick={handleOnClickAdd}
      >
        Add
      </Button>
    </Stack>
  );
}
