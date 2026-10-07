export function loginMailContent(name: string, time: string, email: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>New Login Detected — SweetTreats</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f8f0e9;
  font-family: Arial, Helvetica, sans-serif;
  color: #3b1b16;
">

  <!-- Outer wrapper -->
  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
      width: 100%;
      background-color: #f8f0e9;
      padding: 36px 14px;
    "
  >
    <tr>
      <td align="center">

        <!-- Main email -->
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width: 620px;
            background-color: #fffaf6;
            border-radius: 28px;
            overflow: hidden;
            border: 1px solid #eadbd2;
          "
        >

          <!-- ========================================= -->
          <!-- HEADER -->
          <!-- ========================================= -->

          <tr>
            <td
              style="
                padding: 28px 32px;
                background-color: #3b1b16;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tr>

                  <td valign="middle">

                    <!-- Brand -->
                    <div style="
                      font-size: 23px;
                      line-height: 1;
                      font-weight: 800;
                      letter-spacing: -0.7px;
                      color: #fffaf6;
                    ">
                      SweetTreats
                    </div>

                    <div style="
                      margin-top: 7px;
                      font-size: 10px;
                      line-height: 1.4;
                      font-weight: 700;
                      letter-spacing: 2px;
                      color: #d9c4bb;
                    ">
                      ACCOUNT SECURITY
                    </div>

                  </td>

                  <td
                    align="right"
                    valign="middle"
                  >

                    <!-- Security icon -->
                    <div style="
                      width: 48px;
                      height: 48px;
                      line-height: 48px;
                      text-align: center;
                      background-color: #ffd21f;
                      border-radius: 16px;
                      font-size: 22px;
                    ">
                      🔐
                    </div>

                  </td>

                </tr>
              </table>

            </td>
          </tr>


          <!-- ========================================= -->
          <!-- YELLOW ACCENT -->
          <!-- ========================================= -->

          <tr>
            <td
              style="
                height: 6px;
                background-color: #ffd21f;
                font-size: 0;
                line-height: 0;
              "
            >
              &nbsp;
            </td>
          </tr>


          <!-- ========================================= -->
          <!-- CONTENT -->
          <!-- ========================================= -->

          <tr>
            <td
              style="
                padding: 40px 34px 28px;
              "
            >

              <!-- Greeting -->

              <div style="
                font-size: 14px;
                line-height: 1.5;
                color: #806b63;
              ">
                Hi ${name},
              </div>


              <!-- Heading -->

              <div style="
                margin-top: 7px;
                font-size: 32px;
                line-height: 1.12;
                font-weight: 800;
                letter-spacing: -1px;
                color: #3b1b16;
              ">
                A fresh sign-in<br />
                just happened.
              </div>


              <!-- Yellow underline -->

              <table
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="margin-top: 14px;"
              >
                <tr>
                  <td
                    style="
                      width: 76px;
                      height: 7px;
                      background-color: #ffd21f;
                      border-radius: 10px;
                      font-size: 0;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>
              </table>


              <!-- Description -->

              <div style="
                margin-top: 18px;
                font-size: 15px;
                line-height: 1.75;
                color: #806b63;
              ">
                We noticed a new sign-in to your SweetTreats
                account. If this was you, there's nothing else
                you need to do.
              </div>


              <!-- ========================================= -->
              <!-- SECURITY NOTICE -->
              <!-- ========================================= -->

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  margin-top: 28px;
                  background-color: #fff0ad;
                  border-radius: 20px;
                  border: 1px solid #f1dc78;
                "
              >
                <tr>

                  <td
                    width="52"
                    valign="top"
                    style="
                      padding: 18px 0 18px 18px;
                    "
                  >

                    <div style="
                      width: 34px;
                      height: 34px;
                      line-height: 34px;
                      text-align: center;
                      background-color: #3b1b16;
                      color: #ffd21f;
                      border-radius: 11px;
                      font-size: 15px;
                    ">
                      !
                    </div>

                  </td>

                  <td
                    valign="middle"
                    style="
                      padding: 17px 18px 17px 10px;
                    "
                  >

                    <div style="
                      font-size: 10px;
                      line-height: 1.4;
                      font-weight: 800;
                      letter-spacing: 1.5px;
                      color: #6d4d43;
                    ">
                      SECURITY NOTIFICATION
                    </div>

                    <div style="
                      margin-top: 5px;
                      font-size: 14px;
                      line-height: 1.55;
                      color: #54342d;
                    ">
                      A new login was detected on your account.
                    </div>

                  </td>

                </tr>
              </table>


              <!-- ========================================= -->
              <!-- LOGIN DETAILS -->
              <!-- ========================================= -->

              <div style="
                margin-top: 32px;
                font-size: 11px;
                line-height: 1.4;
                font-weight: 800;
                letter-spacing: 1.5px;
                color: #806b63;
              ">
                LOGIN DETAILS
              </div>


              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  margin-top: 11px;
                  border: 1px solid #e7d9d0;
                  border-radius: 18px;
                  overflow: hidden;
                  background-color: #ffffff;
                "
              >

                <!-- Date -->

                <tr>

                  <td
                    width="38%"
                    style="
                      padding: 16px 18px;
                      border-bottom: 1px solid #eee3dc;
                      font-size: 13px;
                      color: #9a867e;
                    "
                  >
                    Date &amp; time
                  </td>

                  <td
                    style="
                      padding: 16px 18px;
                      border-bottom: 1px solid #eee3dc;
                      font-size: 13px;
                      font-weight: 700;
                      color: #3b1b16;
                    "
                  >
                    ${time}
                  </td>

                </tr>


                <!-- Account -->

                <tr>

                  <td
                    style="
                      padding: 16px 18px;
                      font-size: 13px;
                      color: #9a867e;
                    "
                  >
                    Account
                  </td>

                  <td
                    style="
                      padding: 16px 18px;
                      font-size: 13px;
                      font-weight: 700;
                      color: #3b1b16;
                      word-break: break-word;
                    "
                  >
                    ${email}
                  </td>

                </tr>

              </table>


              <!-- ========================================= -->
              <!-- TRUST MESSAGE -->
              <!-- ========================================= -->

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  margin-top: 28px;
                  background-color: #f8f0e9;
                  border-radius: 20px;
                "
              >
                <tr>

                  <td
                    style="
                      padding: 20px;
                    "
                  >

                    <div style="
                      font-size: 14px;
                      line-height: 1.5;
                      font-weight: 800;
                      color: #3b1b16;
                    ">
                      Was this you?
                    </div>

                    <div style="
                      margin-top: 6px;
                      font-size: 13px;
                      line-height: 1.7;
                      color: #806b63;
                    ">
                      You're all good. You can continue enjoying
                      SweetTreats as usual.
                    </div>

                  </td>

                  <td
                    width="60"
                    align="center"
                    valign="middle"
                    style="
                      padding-right: 18px;
                    "
                  >

                    <div style="
                      width: 40px;
                      height: 40px;
                      line-height: 40px;
                      text-align: center;
                      background-color: #e7f4ea;
                      color: #287447;
                      border-radius: 50%;
                      font-size: 18px;
                      font-weight: 700;
                    ">
                      ✓
                    </div>

                  </td>

                </tr>
              </table>


              <!-- ========================================= -->
              <!-- SECURITY TIPS -->
              <!-- ========================================= -->

              <div style="
                margin-top: 32px;
                padding-top: 25px;
                border-top: 1px solid #eadfd8;
              ">

                <div style="
                  font-size: 14px;
                  line-height: 1.5;
                  font-weight: 800;
                  color: #3b1b16;
                ">
                  Keep your account safe
                </div>

                <div style="
                  margin-top: 12px;
                  font-size: 13px;
                  line-height: 1.9;
                  color: #806b63;
                ">
                  <span style="color: #3b1b16; font-weight: 700;">•</span>
                  Never share your password with anyone.<br />

                  <span style="color: #3b1b16; font-weight: 700;">•</span>
                  Use a unique password for your account.<br />

                  <span style="color: #3b1b16; font-weight: 700;">•</span>
                  Make sure you're signing in from a trusted device.
                </div>

              </div>

            </td>
          </tr>


          <!-- ========================================= -->
          <!-- FOOTER -->
          <!-- ========================================= -->

          <tr>
            <td
              style="
                padding: 28px 30px 30px;
                background-color: #3b1b16;
              "
            >

              <div style="
                text-align: center;
                font-size: 20px;
                line-height: 1;
                font-weight: 800;
                letter-spacing: -0.5px;
                color: #fffaf6;
              ">
                SweetTreats
              </div>


              <div style="
                margin-top: 9px;
                text-align: center;
                font-size: 11px;
                line-height: 1.6;
                color: #d5c0b7;
              ">
                Making every moment a little sweeter.
              </div>


              <!-- Footer links -->

              <div style="
                margin-top: 20px;
                text-align: center;
              ">

                <a
                  href="https://yourwebsite.com"
                  style="
                    color: #ffd21f;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 700;
                  "
                >
                  Website
                </a>

                <span style="
                  color: #795c53;
                  padding: 0 9px;
                ">
                  •
                </span>

                <a
                  href="https://yourwebsite.com/privacy"
                  style="
                    color: #ffd21f;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 700;
                  "
                >
                  Privacy
                </a>

                <span style="
                  color: #795c53;
                  padding: 0 9px;
                ">
                  •
                </span>

                <a
                  href="https://yourwebsite.com/help"
                  style="
                    color: #ffd21f;
                    text-decoration: none;
                    font-size: 11px;
                    font-weight: 700;
                  "
                >
                  Help
                </a>

              </div>


              <!-- Copyright -->

              <div style="
                margin-top: 18px;
                text-align: center;
                font-size: 10px;
                line-height: 1.6;
                color: #9f867d;
              ">
                You're receiving this email because a login
                occurred on your SweetTreats account.
                <br />
                © ${2026} SweetTreats. All rights reserved.
              </div>

            </td>
          </tr>

        </table>


        <!-- Small outside label -->

        <div style="
          max-width: 560px;
          margin-top: 18px;
          text-align: center;
          font-size: 10px;
          line-height: 1.5;
          color: #a28d84;
        ">
          SweetTreats · Freshly made, thoughtfully delivered.
        </div>

      </td>
    </tr>
  </table>

</body>
</html>
`
}
// export function loginMailContent(name: string, time: string, email: string) {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <meta name="color-scheme" content="light" />
//   <title>New Login Detected</title>
// </head>

// <body style="
//   margin: 0;
//   padding: 0;
//   background-color: #f5f7fa;
//   font-family: Arial, Helvetica, sans-serif;
//   color: #172033;
// ">

//   <!-- Main wrapper -->
//   <table
//     role="presentation"
//     width="100%"
//     cellspacing="0"
//     cellpadding="0"
//     border="0"
//     style="background-color: #f5f7fa; padding: 40px 16px;"
//   >
//     <tr>
//       <td align="center">

//         <!-- Email container -->
//         <table
//           role="presentation"
//           width="100%"
//           cellspacing="0"
//           cellpadding="0"
//           border="0"
//           style="
//             max-width: 620px;
//             background-color: #ffffff;
//             border-radius: 18px;
//             overflow: hidden;
//             border: 1px solid #e7eaf0;
//           "
//         >

//           <!-- Header -->
//           <tr>
//             <td
//               style="
//                 background-color: #122438;
//                 padding: 26px 32px;
//               "
//             >
//               <table
//                 role="presentation"
//                 width="100%"
//                 cellspacing="0"
//                 cellpadding="0"
//                 border="0"
//               >
//                 <tr>

//                   <td>
//                     <div style="
//                       font-size: 22px;
//                       font-weight: 700;
//                       color: #ffffff;
//                       letter-spacing: -0.4px;
//                     ">
//                       SweetTreats
//                     </div>

//                     <div style="
//                       margin-top: 4px;
//                       font-size: 12px;
//                       color: #aebdce;
//                       letter-spacing: 0.4px;
//                     ">
//                       ACCOUNT SECURITY
//                     </div>
//                   </td>

//                   <td align="right">
//                     <div style="
//                       width: 42px;
//                       height: 42px;
//                       line-height: 42px;
//                       text-align: center;
//                       background-color: #ffffff;
//                       border-radius: 50%;
//                       font-size: 20px;
//                     ">
//                       🔐
//                     </div>
//                   </td>

//                 </tr>
//               </table>
//             </td>
//           </tr>


//           <!-- Content -->
//           <tr>
//             <td style="padding: 42px 40px 20px 40px;">

//               <!-- Greeting -->
//               <div style="
//                 font-size: 15px;
//                 color: #64748b;
//                 margin-bottom: 8px;
//               ">
//                 Hi ${name},
//               </div>

//               <h1 style="
//                 margin: 0;
//                 font-size: 30px;
//                 line-height: 1.2;
//                 letter-spacing: -0.7px;
//                 color: #122438;
//               ">
//                 New login detected
//               </h1>

//               <p style="
//                 margin: 16px 0 0 0;
//                 font-size: 15px;
//                 line-height: 1.7;
//                 color: #64748b;
//               ">
//                 We noticed a new sign-in to your account. If this was you,
//                 there's nothing you need to do.
//               </p>


//               <!-- Alert -->
//               <table
//                 role="presentation"
//                 width="100%"
//                 cellspacing="0"
//                 cellpadding="0"
//                 border="0"
//                 style="
//                   margin-top: 28px;
//                   background-color: #fff8e8;
//                   border: 1px solid #f6dfaa;
//                   border-radius: 12px;
//                 "
//               >
//                 <tr>
//                   <td style="padding: 18px 20px;">

//                     <div style="
//                       font-size: 13px;
//                       font-weight: 700;
//                       color: #9a6700;
//                       margin-bottom: 5px;
//                     ">
//                       SECURITY NOTIFICATION
//                     </div>

//                     <div style="
//                       font-size: 14px;
//                       line-height: 1.6;
//                       color: #795b13;
//                     ">
//                       A new login was detected on your account.
//                     </div>

//                   </td>
//                 </tr>
//               </table>


//               <!-- Login details -->
//               <div style="
//                 margin-top: 30px;
//                 font-size: 13px;
//                 font-weight: 700;
//                 color: #122438;
//                 text-transform: uppercase;
//                 letter-spacing: 0.7px;
//               ">
//                 Login details
//               </div>

//               <table
//                 role="presentation"
//                 width="100%"
//                 cellspacing="0"
//                 cellpadding="0"
//                 border="0"
//                 style="
//                   margin-top: 12px;
//                   border: 1px solid #e8ebef;
//                   border-radius: 12px;
//                   overflow: hidden;
//                 "
//               >

//                 <tr>
//                   <td style="
//                     padding: 16px 18px;
//                     border-bottom: 1px solid #edf0f3;
//                     width: 40%;
//                     font-size: 13px;
//                     color: #7b8797;
//                   ">
//                     Date & time
//                   </td>

//                   <td style="
//                     padding: 16px 18px;
//                     border-bottom: 1px solid #edf0f3;
//                     font-size: 13px;
//                     font-weight: 600;
//                     color: #172033;
//                   ">
//                     ${time}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td style="
//                     padding: 16px 18px;
//                     font-size: 13px;
//                     color: #7b8797;
//                   ">
//                     Account
//                   </td>

//                   <td style="
//                     padding: 16px 18px;
//                     font-size: 13px;
//                     font-weight: 600;
//                     color: #172033;
//                   ">
//                     ${email}
//                   </td>
//                 </tr>

//               </table>


//               <!-- Primary CTA -->
//               <table
//                 role="presentation"
//                 width="100%"
//                 cellspacing="0"
//                 cellpadding="0"
//                 border="0"
//                 style="margin-top: 30px;"
//               >
               
//               </table>


//               <!-- Security tips -->
//               <div style="
//                 margin-top: 34px;
//                 padding-top: 24px;
//                 border-top: 1px solid #edf0f3;
//               ">

//                 <div style="
//                   font-size: 13px;
//                   font-weight: 700;
//                   color: #172033;
//                 ">
//                   Keep your account secure
//                 </div>

//                 <div style="
//                   margin-top: 12px;
//                   font-size: 13px;
//                   line-height: 1.8;
//                   color: #64748b;
//                 ">
//                   • Never share your password with anyone.<br />
//                   • Use a unique password for your account.<br />
//                   • Make sure you're signing in from a trusted device.
//                 </div>

//               </div>

//             </td>
//           </tr>


//           <!-- Footer -->
//           <tr>
//             <td
//               style="
//                 padding: 28px 40px;
//                 background-color: #f8fafc;
//                 border-top: 1px solid #edf0f3;
//               "
//             >

//               <div style="
//                 text-align: center;
//                 font-size: 14px;
//                 font-weight: 700;
//                 color: #122438;
//               ">
//                 SweetTreats
//               </div>

//               <div style="
//                 margin-top: 8px;
//                 text-align: center;
//                 font-size: 12px;
//                 line-height: 1.6;
//                 color: #8a96a6;
//               ">
//                 Making every moment a little sweeter.
//               </div>

//               <div style="
//                 margin-top: 16px;
//                 text-align: center;
//               ">
//                 <a
//                   href="https://yourwebsite.com"
//                   style="
//                     color: #64748b;
//                     text-decoration: none;
//                     font-size: 12px;
//                   "
//                 >
//                   Website
//                 </a>

//                 <span style="
//                   color: #cbd1d8;
//                   padding: 0 8px;
//                 ">
//                   •
//                 </span>

//                 <a
//                   href="https://yourwebsite.com/privacy"
//                   style="
//                     color: #64748b;
//                     text-decoration: none;
//                     font-size: 12px;
//                   "
//                 >
//                   Privacy
//                 </a>

//                 <span style="
//                   color: #cbd1d8;
//                   padding: 0 8px;
//                 ">
//                   •
//                 </span>

//                 <a
//                   href="https://yourwebsite.com/help"
//                   style="
//                     color: #64748b;
//                     text-decoration: none;
//                     font-size: 12px;
//                   "
//                 >
//                   Help
//                 </a>
//               </div>

//               <div style="
//                 margin-top: 18px;
//                 text-align: center;
//                 font-size: 11px;
//                 line-height: 1.5;
//                 color: #a0a9b5;
//               ">
//                 You're receiving this email because a login
//                 occurred on your SweetTreats account.
//                 <br />
//                 © ${2026} SweetTreats. All rights reserved.
//               </div>

//             </td>
//           </tr>

//         </table>

//       </td>
//     </tr>
//   </table>

// </body>
// </html>
// `
// }