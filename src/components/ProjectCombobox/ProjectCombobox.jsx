import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import { fetchProjects } from "../../services/zeplin";

export default function ProjectCombobox({ onProjectSelect }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState();
  const loading = open && !options;

  const onOpen = async () => {
    setOpen(true);

    if (options) {
      return;
    }

    const projects = await fetchProjects();

    setOptions(
      projects.map((project) => ({
        name: project.name,
        value: project,
      }))
    );
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (event, value) => {
    if (value) {
      onProjectSelect(value.value);
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      onChange={onChange}
      getOptionSelected={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.name}
      options={options || []}
      loading={loading}
      noOptionsText="No projects in this account"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a Zeplin project"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
