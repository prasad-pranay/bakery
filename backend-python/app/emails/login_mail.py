def login_mail_content(name: str, time: str, email: str) -> str:
    return f"""<!DOCTYPE html>
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
                Hi {name},
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
                    {time}
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
                    {email}
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
                © 2026 SweetTreats. All rights reserved.
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
"""
