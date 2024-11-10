// Invoice.js

import React from 'react';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import invoicePng from '../assets/images/invoice-icon.png'
import { invoiceDocument, invoiceDocument2 } from '../helper/invoiceDocument';


pdfMake.vfs = pdfFonts.pdfMake.vfs;


const generateInvoice = async (invoice, data) => {
  try {
    let doc = await invoiceDocument(invoice, data)
    pdfMake.createPdf(doc).open();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

const generateInvoice2 = async (invoice, data) => {
  try {
    let doc = await invoiceDocument2(invoice, data)
    pdfMake.createPdf(doc).open();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
const Invoice = ({ invoice, inTable = false,userData=null }) => {
  let data = {
    customerNumber: userData?.id,
    reference: userData?.name,
    address:userData?.address,
  }

  return (

    <>{
      inTable ?
        <img src={invoicePng} alt='invoice' style={{ width: "30px", height: "36px", cursor: "pointer" }} onClick={() => generateInvoice(invoice, data)} />

        :
        <button type="button" className='btn btn-primary   text-center' onClick={() => generateInvoice2(invoice, data)}>Download Invoice</button>
    }

    </>
  )

};

export default Invoice;
