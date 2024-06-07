import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { CustomThemeContext } from "@/themes/CustomThemeContext";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useMediaQuery } from '@mui/material';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import moment from "moment/moment";
import axios from "axios";
import {accountNumber, timeFormated} from "@/components/utils/userData";

const backendApiUrl = process.env.BACKEND_API_URL ?? 'http://localhost:5000'
const backendApiToken = process.env.BACKEND_API_TOKEN ?? 'set-your-token-in-the-.env-file'
const initialRows: GridRowsProp = [];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    // const id = randomId();
    // setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    // setRowModesModel((oldModel) => ({
    //   ...oldModel,
    //   [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    // }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}



  const CustomersPage: React.FC = () => {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const themes = React.useContext(CustomThemeContext);
    const isSmallScreen = useMediaQuery('(max-width:450px)');
    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };

    const handleEditClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };



   
      React.useEffect(() => {
          handleCustomerList();
      }, []);
      const handleCustomerList = async()=>{
          const source = axios?.CancelToken?.source();
          try{
              console.log("call")
              const res = await axios.get(`${backendApiUrl}/api/customers`,
                  {
                      headers: {
                          Authorization: `Bearer ${backendApiToken}`,
                      },
                  });
                  console.log("customer table res==>",res)
              if(res?.data?.length > 0){
                  let updatedArr = res?.data?.map(({name,exchangeCustomerId}: any) => {
                      return {
                          id: parseInt(exchangeCustomerId),
                          name:name,
                          login:""                      
                        };
                  });

                  setRows(updatedArr);
              }else{
                setRows([])
              }
          }catch(e){
            setRows([])
          }


      }

      const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      };
    
      const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
      };
    
      const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
          setRows(rows.filter((row) => row.id !== id));
        }
      };
    
      const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      };
    
      const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
      };

      const columnWidth = isSmallScreen ? 160 : 210;
      const columns: GridColDef[] = [
        { field: 'name', headerName: 'Customer', width: columnWidth, editable: false,headerClassName:"tHeading",cellClassName:"headContent" },
        { field: 'login', headerName: 'Login', width: columnWidth, editable: true,headerClassName:"tHeading",cellClassName:"headContent" },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Edit Login',
          headerClassName:"tHeading",
          width: 100,
          cellClassName: 'actions',
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }
    
            return [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
               
              />,
            
            ];
          },
        },
      ];


      return (
        <div
        style={{
          // height: "24rem",
          width: "35rem",
          backgroundColor: themes.currentTheme === "dark" ? "#3b3b44" : "#F9F9F9",
          padding: 10,
        }}
    
        className='customerTableContainer'
        >
          <Typography
              variant="h5"
              sx={{ paddingBottom: 1 }}
            >
              Customers
            </Typography>
        <Box
          sx={{
            height: 500,
            width: '90%%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0
                ? themes.currentTheme === "dark"
                  ? "evenDarkRow"
                  : "evenLightRow"
                : ""
            }
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </Box>
        </div>
    
      );
  
}

export default CustomersPage;