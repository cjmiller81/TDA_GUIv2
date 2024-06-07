import React,{ useState,useEffect } from "react";
import PageTitle from "@/components/TextDisplay/PageTitle";
import SubTitle from "@/components/TextDisplay/SubTitle";
import Tile from "@/components/RFQ Tile/Tile";   
import CurrencyDropdown from '@/components/currencyDropdown/CurrencyDropdown'
import RFQTable from "@/components/Tables/rfqTable";
import { Box, CardMedia, IconButton, SvgIcon, Paper, Avatar, Typography } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

import HLOGO from "../../../../src/Images/dark.png"
import axios from "axios";
import {RfqQuote} from "@/components/RFQ Tile/RfqQuote";
import {accountNumber,timeFormated} from '@/components/utils/userData'
import moment from "moment";


const backendApiUrl = process.env.BACKEND_API_URL ?? 'http://localhost:5000'
const backendApiToken = process.env.BACKEND_API_TOKEN ?? 'set-your-token-in-the-.env-file'
export default function SpotRFQPage() {
    const DefaultSymbol1 = 'USDT';
    const DefaultSymbol2 = 'USD';
    const [symbol1, setSymbol1] = useState<string>(DefaultSymbol1);
    const [symbol2, setSymbol2] = useState<string>(DefaultSymbol2);
  const [open, setOpen] = React.useState<boolean>(false);
  const [placingOrder, setPlacingOrder] = React.useState<boolean>(false);
  const [tradeSide,setTradeSide] = React.useState<string>("Buy");
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
  const [rows, setRows] = React.useState<RfqQuote[]>([]);
  const [cancelToken, setCancelToken] = React.useState<any>(null);
  const [obj, setObj] = React.useState<any>({
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal } = obj;


  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      console.log("notification supported")
      Notification.requestPermission();
    }

    getHistoryData();
  }, []);

    const handlePlaceOrderRequest = async (payload: any) => {
        if (payload) {
            try {
                if (cancelToken) {
                    cancelToken.cancel("Request canceled");
                }

                // Create a new cancel token
                const source = axios?.CancelToken?.source();
                console.log('source', source)
                setCancelToken(source);
                setPlacingOrder(true);
                
                const response = await axios.post(
                    `${backendApiUrl}/api/customers/placeorder`,
                    payload,
                    {
                        cancelToken: source.token,
                        headers: {
                            'Authorization': `Bearer ${backendApiToken}`            }
                    }
                );
                if (response?.data) {
                    console.log('response =>',response?.data)
                    let obj = response?.data[0];
                    
                    setPlacingOrder(false);
                    
                } else {
                    alert("request failed");
                    setTimeout(() => {
                        setPlacingOrder(false);
                    }, 2000);
                }
            } catch (error) {
                if (axios.isCancel(error)) {
                    // Request was canceled
                    console.log("Request canceled:", error);
                } else {
                    console.error("Error:", error);
                }
            } finally {
                setPlacingOrder(false);
            }
        } else {
            alert("Currency is required");
        }
    };

 

  const showNotification = (notificationOptions: any)=>{
    // Check if the Notification API is supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return;
    }
  
    // Check if the user has granted permission for notifications
    if (Notification.permission === 'granted') {
      // If permission has been granted, show the notification
      const options: NotificationOptions = {
        body: `${notificationOptions?.side} ${notificationOptions?.symbol1} ${notificationOptions?.qty} vs ${notificationOptions?.symbol2} @ ${notificationOptions?.price}`,
        icon: 'https://tda-gui-v2.vercel.app/static/images/dark.png?auto=compress&cs=tinysrgb&dpr=1&w=500',
        dir: 'ltr',
      };
  
      const notification = new Notification(`Trade Accepted: ID ${notificationOptions?.id}`, options);
    } else if (Notification.permission !== 'denied') {
      // If permission hasn't been denied yet, request permission
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // If permission has been granted, show the notification
          const options: NotificationOptions = {
            body: `${notificationOptions?.side} ${notificationOptions?.symbol1} ${notificationOptions?.qty} vs ${notificationOptions?.symbol2} @ ${notificationOptions?.price}`,
            icon: 'https://tda-gui-v2.vercel.app/static/images/dark.png?auto=compress&cs=tinysrgb&dpr=1&w=500',
            dir: 'ltr',
          };
  
          const notification = new Notification(`Trade Accepted: ID ${notificationOptions?.id}`, options);
        } else {
          console.log('User has denied permission for notifications.');
        }
      });
    } else {
      console.log('User has denied permission for notifications.');
    }
  }


    // Function to update symbol1
    const handleSymbolOne = (newSymbol: string) => {
      console.log("symbol1",newSymbol)
        if(newSymbol){
            setSymbol1(newSymbol);      
        }else{
            setSymbol1(DefaultSymbol1);
        }
      
    };
  
    // Function to update symbol2
    const handleSymbolTwo = (newSymbol: string) => {
      console.log("symbol2", newSymbol);
      if(newSymbol){
          setSymbol2(newSymbol);
      }else{
          setSymbol2(DefaultSymbol2);
      }
      
    };
    function generateRandomId() {
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate random number between 1000 and 9999
      return randomNumber.toString(); // Convert the random number to string
    }

    const handleAddRow = (val: Partial<RfqQuote>) => {
    const newId = generateRandomId();
    let fillQtyVal = parseFloat(val?.filledQty || "0");
    let formattedFillQty = fillQtyVal?.toLocaleString("en-US");
    let reqPayload = {
        // id: newId,
        transactTime: val.transactTime || "",
        symbol: val.symbol || "",
        side: val.side || "",
        filledQty: val.filledQty || "",
        accountNum: val.accountNum || "",
        status: val.status || "",
        QuoteID: val.QuoteID || "",
        RFQID: val.RFQID || ""
    }
    handlePlaceOrderRequest(reqPayload).then(d => {
        const newRow: RfqQuote = {
            id: newId,
            transactTime: val.transactTime || "",
            symbol: val.symbol || "",
            side: val.side || "",
            filledQty: val.filledQty || "",
            filledPrice: val.filledPrice || "",
            accountNum: val.accountNum || "",
            status: val.status || "",
            QuoteID: val.QuoteID || "",
            RFQID: val.RFQID || ""
        };
        // setRows([newRow, ...rows]);
        // console.log("newRow", newRow)
        getHistoryData();
        let obj = {
            id: newRow?.id,
            symbol1: symbol1,
            symbol2: symbol2,
            side: newRow?.side,
            qty: formattedFillQty,
            price:newRow.filledPrice,
            QuoteID:newRow.QuoteID,
            RFQID:newRow.RFQID
        }

        setTradeSide(val?.side || "")

        let x = parseFloat(newRow.filledPrice) * parseFloat(newRow.filledQty);
        let formatted =  x.toLocaleString("en-US")
        if(newRow?.side == "Buy"){
            setSnackbarMessage(`You have Bought ${formattedFillQty} ${symbol1} and Sold ${formatted} ${symbol2} (Notional Value) at a Rate of ${newRow.filledPrice}`);
        }else{
            setSnackbarMessage(`You have Sold ${formattedFillQty} ${symbol1} and Bought ${formatted} ${symbol2} (Notional Value) at a Rate of ${newRow.filledPrice}`);
        }

        setOpen(true);
        showNotification(obj)
    }).catch(e => {
        console.log("Error",e)
    })
      
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const getHistoryData = async() => {
      try{
        const res = await axios.get(`${backendApiUrl}/api/customers/order-history?accountNumber=${accountNumber}`,{
            headers: {
                'Authorization': `Bearer ${backendApiToken}`            }
        });
        if(res?.data?.length > 0){
          let updatedArr = res?.data?.map(({ qtyPlaced,exchangeOrderId,marketSymbol,timeLastUpdated,instruction,priceSubmitted,orderStatus }: any) => {
            return {
              filledQty: String(qtyPlaced),
              id:exchangeOrderId,
              symbol:marketSymbol,
              transactTime:timeFormated(timeLastUpdated),
              side:instruction,
              filledPrice:String(priceSubmitted),
              status:orderStatus
            };
        });
            updatedArr = updatedArr.reverse()
        console.log("res=>",res)
            setRows(updatedArr);
        }else{
            setRows([])
          }
        }catch(e){
          setRows([])
        }
    }


    

    const handleHistoryRequest = async(dateVal : any)=>{
      let fromDate = new Date(dateVal?.fromDate);
      let formatedFromDate = moment(fromDate).format('YYYY-MM-DD');

      let toDate = new Date(dateVal?.toDate)
      let formatedToDate = moment(toDate).format('YYYY-MM-DD');

      try{
      const res = await axios.get(`${backendApiUrl}/customer/orderhistory?accountNumber=${accountNumber}&startDate=${formatedFromDate}&endDate=${formatedToDate}`,{
          headers: {
              'Authorization': `Bearer ${backendApiToken}`            }
      });
      if(res?.data?.length > 0){
        let updatedArr = res?.data?.map(({ qtyPlaced,exchangeOrderId,marketSymbol,timeLastUpdated,instruction,priceSubmitted,orderStatus }: any) => {
          return {
            filledQty: String(qtyPlaced),
            id:exchangeOrderId,
            symbol:marketSymbol,
            transactTime:timeFormated(timeLastUpdated),
            side:instruction,
            filledPrice:String(priceSubmitted),
            status:orderStatus
          };
      });
          updatedArr = updatedArr.reverse()
          setRows(updatedArr);
      }else{
          setRows([])
      }
    }catch(e){
      setRows([]) 
    }


    }

  return (
    <>
      <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={7000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
         <SnackbarContent style={{
          backgroundColor: tradeSide == 'Buy' ? '#E2F0D9' : '#FFDDDD',
          color:'#000000',
          fontWeight:500
          }}
          message={<span id="client-snackbar">{snackbarMessage}</span>}
        />
      </Snackbar>
      </div>
      <div className="tileParent">
      <PageTitle
        sx={{
          textWrap: "nowrap",
          minWidth: "300px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        Request for Quote Portal
      </PageTitle>
      <SubTitle
        sx={{
          textWrap: "nowrap",
          minWidth: "300px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        Click Initiate RFQ to instantly receive a quote
      </SubTitle>
      </div>
      <Box
      sx={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
      }}
      className="dropdownContainer"
      >
        <CurrencyDropdown handleSymbolOne={handleSymbolOne} handleSymbolTwo={handleSymbolTwo} />

      </Box>
        
      <Box
      sx={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',

        // marginTop:15,
      }}
      className="tileParent"
      >
      <Tile symbol1={symbol1} symbol2={symbol2} handleSymbolTwo= {handleSymbolTwo} handleAddRow={handleAddRow} />
      </Box>

      <Box
        sx={{
          marginTop: 5,
        }}
        className="tableParent"
      >
        <RFQTable rows={rows} handleHistoryRequest={handleHistoryRequest} />
      </Box>

    </>
  );
}