import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useCallback, useMemo, useState } from "react";

export default function FormGroupPer({ pers = [], onChange }) {
  const handleChange = useCallback(
    (event) => {
      const { name, checked } = event.target;

      let tempPers;

      const nameSlipt = name.split(".");

      if (nameSlipt[0] === "all") {
        const module = nameSlipt[1];

        tempPers = pers.map((per) => {
          if (module === per.name) {
            const item = per.child;

            const tempItem = item.map((i) => ({ ...i, isChecked: checked }));

            return { ...per, child: tempItem };
          }

          return per;
        });
      } else {
        tempPers = pers.map((per) => {
          const item = per.child;

          const tempItem = item.map((i) =>
            i._id === name ? { ...i, isChecked: checked } : i
          );

          return { ...per, child: tempItem };
        });
      }

      onChange(tempPers);
    },
    [pers]
  );

  return (
    <>
      {pers.length ? (
        pers.map((row, index) => (
          <Box border="1px solid #dedede" borderRadius={1} key={index} mt={2}>
            <Box
              bgcolor="#ededed"
              px={2}
              py={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderRadius="8px 8px 0  0px"
              textTransform="capitalize"
            >
              <FormControlLabel
                sx={{ fontWeight: 700 }}
                label={row.name}
                control={
                  <Checkbox
                    name={`all.${row.name}`}
                    checked={row.child.every((i) => i?.isChecked)}
                    onChange={handleChange}
                  />
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                gap: 2,
              }}
            >
              {row.child &&
                row.child.length &&
                row.child.map((item, idx) => (
                  <FormControlLabel
                    key={idx}
                    label={item.name}
                    control={
                      <Checkbox
                        name={item._id}
                        onChange={handleChange}
                        checked={item.isChecked || false}
                      />
                    }
                  />
                ))}
            </Box>
          </Box>
        ))
      ) : (
        <Box border="1px solid #dedede" borderRadius={1}>
          <Box
            bgcolor="#ededed"
            px={2}
            py={1}
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            alignItems="center"
            borderRadius="8px 8px 0  0px"
          >
            Chưa có quyền nào.
          </Box>
        </Box>
      )}
    </>
  );
}
