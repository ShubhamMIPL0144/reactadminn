export const invoiceDocument = async (invoice, data) => {
  const documentDefinition = {
    content: [
      // Header
      {
        columns: [
          [
            {
              text: "Kvitto",
              style: "invoiceTitle",
              width: "*",
            },

            {
              stack: [
                {
                  columns: [
                    {
                      text: "LUSGO",
                      style: "logoStyle",
                    },
                    {
                      text: `Kvittonummer: ${invoice?.invoiceNo} \n \n Ordernummer: ${invoice?.orderId} \n \n ${invoice?.userInfodetails?.address}`,
                      style: "invoiceSubTitle",
                      width: "*",
                    },

                    {
                      text: `Datum utfärdat \n ${new Date(
                        invoice.createdDate
                      ).toLocaleDateString("sv", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`,
                      style: "invoiceSubValue",
                      width: 90,
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },

      // Billing Details
      {
        columns: [
          {
            text: "Kundnr",
            style: "invoiceBillingDetails1",
            width: 100,
          },
          {
            text: invoice?.userInfodetails?.id,
            style: "invoiceBillingDetails1",
          },
        ],
      },
      {
        columns: [
          {
            text: "Er referens",
            style: "invoiceBillingDetails2",
            width: 100,
          },
          {
            text: invoice?.userInfodetails?.name,
            style: "invoiceBillingDetails2",
          },
        ],
      },
      // Billing Address Title

      // Line breaks
      "\n\n",
      // Items
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ["*", 40, "auto",80],

          body: [
            // Table Header
            [
              {
                text: "Annons publicerad",
                style: "itemsHeader",
              },
              {
                text: "Antal",
                style: ["itemsHeader", "center"],
              },
              {
                text: "Pris",
                style: ["itemsHeader", "center"],
              },
              // {
              //   text: "Beskatta",
              //   style: ["itemsHeader", "center"],
              // },
              // {
              //   text: "Rabatt",
              //   style: ["itemsHeader", "center"],
              // },
              {
                text: "Total",
                style: ["itemsHeader", "center"],
              },
            ],
            // Items
            // Item 1
            [
              [
                // {
                //   text: "Punkt 1",
                //   style: "itemTitle",
                // },
                {
                  text: "Annonsering",
                  style: "itemsHeader",
                },
              ],
              {
                text: "1",
                style: "itemNumber",
              },
              {
                text: `${invoice.totalprice || invoice.totalPrice} kr`,
                style: "itemNumber",
              },
              // {
              //   text: `${invoice.tax}`,
              //   style: "itemNumber",
              // },
              // {
              //   text: `${invoice.discount}%`,
              //   style: "itemNumber",
              // },
              {
                text: `${invoice.totalprice || invoice.totalPrice} kr`,
                style: "itemTotal",
              },
            ],
          ],
        }, // table
        //  layout: 'lightHorizontalLines'
      },

      // '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
      // TOTAL
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 0,
          widths: ["*", 80],

          body: [
            // Total

            [
              {
                text: `Rabattbelopp \n Pris efter rabatt \n Total Moms ${invoice.tax} belopp`,
                style: "itemsFooterTotalDetailsTitle",
                margin: [5, 200, 10, 5],
              },
              {
                text: `${invoice.discountamount} kr \n ${
                  invoice.priceAfterDiscount || invoice.priceafterdiscount
                } kr \n ${invoice.taxPriceAddition} kr`,
                style: "itemsFooterTotalDetailsValue",
                margin: [5, 200, 10, 5],
              },
            ],

            [
              {
                text: "TOTAL",
                style: "itemsFooterTotalTitle",
              },
              {
                text: invoice.priceAfterTaxTotal + " kr",
                style: "itemsFooterTotalValue",
              },
            ],
          ],
        }, // table
        // layout: 'lightHorizontalLines'
      },
      // Signature
      {
        columns: [
          {
            text: "",
          },
        ],
      },

      {
        text: "Adress",
        style: "notesTitle",
      },
      {
        columns: [
          {
            text: "Lusgo\nSkägglavsvägen 3\n15252 Södertälje, faktura@lusgo.se\nlusgo.se",
            style: "notesText",
            width: 350,
          },
          {
            text: "\n\nGodkänd för F-skatt ",
            style: "notesText",
            width: 50,
          },
          {
            text: "Organisationsnr \n559176-9541 \nMomsreg.nr \n SE559176954101",
            style: "notesText",
          },
        ],
      },
    ],
    styles: {
      // Document Header
      documentHeaderLeft: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "left",
      },
      documentHeaderCenter: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "center",
      },
      documentHeaderRight: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "right",
      },
      // Document Footer
      documentFooterLeft: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "left",
      },
      documentFooterCenter: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "center",
      },
      documentFooterRight: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "right",
      },
      //Logo
      logoStyle: {
        fontSize: 28,
        bold: true,
      },
      // Invoice Title
      invoiceTitle: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 15],
      },
      // Invoice Details
      invoiceSubTitle: {
        fontSize: 12,
        alignment: "left",
        margin: [0, 4],
      },
      invoiceSubImage: {
        alignment: "left",
        margin: [0, 0],
      },
      invoiceSubValue: {
        fontSize: 12,
        alignment: "right",
        margin: [0, 0],
      },
      // Billing Headers
      invoiceBillingTitle: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 5],
      },
      // Billing Details
      invoiceBillingDetails1: {
        alignment: "left",
        margin: [0, 40, 0, 0],
      },
      invoiceBillingDetails2: {
        alignment: "left",
        margin: [0, 0, 0, 0],
      },
      invoiceBillingAddressTitle: {
        margin: [0, 7, 0, 3],
        bold: true,
      },
      invoiceBillingAddress: {
        margin: [0, 12, 0, 0],
      },
      // Items Header
      itemsHeader: {
        margin: [0, 5, 0, 5],
        bold: true,
      },
      // Item Title
      itemTitle: {
        bold: true,
      },
      itemSubTitle: {
        italics: true,
        fontSize: 11,
      },
      itemNumber: {
        margin: [0, 5, 0, 5],
        alignment: "center",
      },
      itemTotal: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "center",
      },

      // Items Footer (Subtotal, Total, Tax, etc)
      itemsFooterSubTitle: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "right",
      },
      itemsFooterSubValue: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "center",
      },
      itemsFooterTotalDetailsTitle: {
        margin: [0, 5, 0, 5],
        bold: false,
        alignment: "right",
      },
      itemsFooterTotalDetailsValue: {
        margin: [0, 5, 0, 5],
        bold: false,
        alignment: "center",
      },
      itemsFooterTotalTitle: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "right",
      },
      itemsFooterTotalValue: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "center",
      },
      signaturePlaceholder: {
        margin: [0, 70, 0, 0],
      },
      signatureName: {
        bold: true,
        alignment: "center",
      },
      signatureJobTitle: {
        italics: true,
        fontSize: 10,
        alignment: "center",
      },
      notesTitle: {
        fontSize: 10,
        bold: true,
        margin: [0, 50, 0, 3],
      },
      notesText: {
        fontSize: 10,
        margin: [0, 0, 0, 3],
      },
      notesText2: {
        fontSize: 10,
        margin: [0, 0, 0],
      },
      center: {
        alignment: "center",
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };

  return documentDefinition;
};



export const invoiceDocument2 = async (invoice, data) => {
  const documentDefinition = {
    content: [
      // Header
      {
        columns: [
          [
            {
              text: "Kvitto",
              style: "invoiceTitle",
              width: "*",
            },

            {
              stack: [
                {
                  columns: [
                    {
                      text: "LUSGO",
                      style: "logoStyle",
                    },
                    {
                      text: `Kvittonummer: ${invoice?.invoiceNo} \n \n Ordernummer: ${invoice?.orderId} \n \n ${data.address}`,
                      style: "invoiceSubTitle",
                      width: "*",
                    },

                    {
                      text: `Datum utfärdat \n ${new Date(
                        invoice.createdDate
                      ).toLocaleDateString("sv", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`,
                      style: "invoiceSubValue",
                      width: 90,
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },

      // Billing Details
      {
        columns: [
          {
            text: "Kundnr",
            style: "invoiceBillingDetails1",
            width: 100,
          },
          {
            text: data.customerNumber,
            style: "invoiceBillingDetails1",
          },
        ],
      },
      {
        columns: [
          {
            text: "Er referens",
            style: "invoiceBillingDetails2",
            width: 100,
          },
          {
            text: data.reference,
            style: "invoiceBillingDetails2",
          },
        ],
      },
      // Billing Address Title

      // Line breaks
      "\n\n",
      // Items
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ["*", 40, "auto",80],

          body: [
            // Table Header
            [
              {
                text: "Annons publicerad",
                style: "itemsHeader",
              },
              {
                text: "Antal",
                style: ["itemsHeader", "center"],
              },
              {
                text: "Pris",
                style: ["itemsHeader", "center"],
              },
              // {
              //   text: "Beskatta",
              //   style: ["itemsHeader", "center"],
              // },
              // {
              //   text: "Rabatt",
              //   style: ["itemsHeader", "center"],
              // },
              {
                text: "Total",
                style: ["itemsHeader", "center"],
              },
            ],
            // Items
            // Item 1
            [
              [
                // {
                //   text: "Punkt 1",
                //   style: "itemTitle",
                // },
                {
                  text: "Annonsering",
                  style: "itemsHeader",
                },
              ],
              {
                text: "1",
                style: "itemNumber",
              },
              {
                text: `${invoice.totalprice || invoice.totalPrice} kr`,
                style: "itemNumber",
              },
              // {
              //   text: `${invoice.tax}`,
              //   style: "itemNumber",
              // },
              // {
              //   text: `${invoice.discount}%`,
              //   style: "itemNumber",
              // },
              {
                text: `${invoice.totalprice || invoice.totalPrice} kr`,
                style: "itemTotal",
              },
            ],
          ],
        }, // table
        //  layout: 'lightHorizontalLines'
      },

      // '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
      // TOTAL
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 0,
          widths: ["*", 80],

          body: [
            // Total

            [
              {
                text: `Rabattbelopp \n Pris efter rabatt \n Total Moms ${invoice.tax} belopp`,
                style: "itemsFooterTotalDetailsTitle",
                margin: [5, 200, 10, 5],
              },
              {
                text: `${invoice.discountamount} kr \n ${
                  invoice.priceAfterDiscount || invoice.priceafterdiscount
                } kr \n ${invoice.taxPriceAddition} kr`,
                style: "itemsFooterTotalDetailsValue",
                margin: [5, 200, 10, 5],
              },
            ],

            [
              {
                text: "TOTAL",
                style: "itemsFooterTotalTitle",
              },
              {
                text: invoice.priceAfterTaxTotal + " kr",
                style: "itemsFooterTotalValue",
              },
            ],
          ],
        }, // table
        // layout: 'lightHorizontalLines'
      },
      // Signature
      {
        columns: [
          {
            text: "",
          },
        ],
      },

      {
        text: "Adress",
        style: "notesTitle",
      },
      {
        columns: [
          {
            text: "Lusgo\nSkägglavsvägen 3\n15252 Södertälje, faktura@lusgo.se\nlusgo.se",
            style: "notesText",
            width: 350,
          },
          {
            text: "\n\nGodkänd för F-skatt ",
            style: "notesText",
            width: 50,
          },
          {
            text: "Organisationsnr \n559176-9541 \nMomsreg.nr \n SE559176954101",
            style: "notesText",
          },
        ],
      },
    ],
    styles: {
      // Document Header
      documentHeaderLeft: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "left",
      },
      documentHeaderCenter: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "center",
      },
      documentHeaderRight: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "right",
      },
      // Document Footer
      documentFooterLeft: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "left",
      },
      documentFooterCenter: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "center",
      },
      documentFooterRight: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
        alignment: "right",
      },
      //Logo
      logoStyle: {
        fontSize: 28,
        bold: true,
      },
      // Invoice Title
      invoiceTitle: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 15],
      },
      // Invoice Details
      invoiceSubTitle: {
        fontSize: 12,
        alignment: "left",
        margin: [0, 4],
      },
      invoiceSubImage: {
        alignment: "left",
        margin: [0, 0],
      },
      invoiceSubValue: {
        fontSize: 12,
        alignment: "right",
        margin: [0, 0],
      },
      // Billing Headers
      invoiceBillingTitle: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 5],
      },
      // Billing Details
      invoiceBillingDetails1: {
        alignment: "left",
        margin: [0, 40, 0, 0],
      },
      invoiceBillingDetails2: {
        alignment: "left",
        margin: [0, 0, 0, 0],
      },
      invoiceBillingAddressTitle: {
        margin: [0, 7, 0, 3],
        bold: true,
      },
      invoiceBillingAddress: {
        margin: [0, 12, 0, 0],
      },
      // Items Header
      itemsHeader: {
        margin: [0, 5, 0, 5],
        bold: true,
      },
      // Item Title
      itemTitle: {
        bold: true,
      },
      itemSubTitle: {
        italics: true,
        fontSize: 11,
      },
      itemNumber: {
        margin: [0, 5, 0, 5],
        alignment: "center",
      },
      itemTotal: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "center",
      },

      // Items Footer (Subtotal, Total, Tax, etc)
      itemsFooterSubTitle: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "right",
      },
      itemsFooterSubValue: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "center",
      },
      itemsFooterTotalDetailsTitle: {
        margin: [0, 5, 0, 5],
        bold: false,
        alignment: "right",
      },
      itemsFooterTotalDetailsValue: {
        margin: [0, 5, 0, 5],
        bold: false,
        alignment: "center",
      },
      itemsFooterTotalTitle: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "right",
      },
      itemsFooterTotalValue: {
        margin: [0, 5, 0, 5],
        bold: true,
        alignment: "center",
      },
      signaturePlaceholder: {
        margin: [0, 70, 0, 0],
      },
      signatureName: {
        bold: true,
        alignment: "center",
      },
      signatureJobTitle: {
        italics: true,
        fontSize: 10,
        alignment: "center",
      },
      notesTitle: {
        fontSize: 10,
        bold: true,
        margin: [0, 50, 0, 3],
      },
      notesText: {
        fontSize: 10,
        margin: [0, 0, 0, 3],
      },
      notesText2: {
        fontSize: 10,
        margin: [0, 0, 0],
      },
      center: {
        alignment: "center",
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };

  return documentDefinition;
};



