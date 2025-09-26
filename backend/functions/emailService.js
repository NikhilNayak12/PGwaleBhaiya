const nodemailer = require('nodemailer');
const config = require('./config');

// Create transporter
const transporter = nodemailer.createTransport({
  service: config.EMAIL_CONFIG.service,
  auth: {
    user: config.EMAIL_CONFIG.auth.user,
    pass: config.EMAIL_CONFIG.auth.pass
  }
});

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Send landlord registration notification
const sendLandlordRegistrationNotification = async (landlordData) => {
  try {
    const { name, email, phone, businessName } = landlordData;
    
    // Email to admin
    const adminMailOptions = {
      from: config.EMAIL_CONFIG.auth.user,
      to: config.DEFAULT_ADMIN_EMAIL,
      subject: '🏠 New Landlord Registration - PG Wale Bhaiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏠 New Landlord Registration</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">PG Wale Bhaiya Admin Panel</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #343a40; margin-bottom: 20px;">Landlord Details:</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Full Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Phone:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${phone}</td>
                </tr>
                ${businessName ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">Business Name:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${businessName}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; color: #155724; font-weight: bold;">📝 Action Required:</p>
              <p style="margin: 5px 0 0 0; color: #155724;">Please review this landlord registration and approve/reject as necessary in the admin panel.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${config.NODE_ENV === 'production' ? 'https://pgwalebhaiya.com' : 'http://localhost:5173'}/admin/dashboard" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Admin Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This is an automated notification from PG Wale Bhaiya</p>
            <p>© ${new Date().getFullYear()} PG Wale Bhaiya. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Email to landlord (welcome email)
    const landlordMailOptions = {
      from: config.EMAIL_CONFIG.auth.user,
      to: email,
      subject: '🏠 Welcome to PG Wale Bhaiya - Registration Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to PG Wale Bhaiya!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Thank you for joining our platform</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #343a40; margin-bottom: 20px;">Hello ${name}!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
              <p style="margin: 0 0 15px 0; color: #495057; font-size: 16px;">
                Your landlord account has been successfully created! We're excited to have you as part of the PG Wale Bhaiya family.
              </p>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <h3 style="margin: 0 0 10px 0; color: #155724;">✅ What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #155724;">
                  <li style="margin-bottom: 8px;">Log in to your dashboard using your credentials</li>
                  <li style="margin-bottom: 8px;">Complete your profile information</li>
                  <li style="margin-bottom: 8px;">Start listing your PG accommodations</li>
                  <li>Connect with potential tenants</li>
                </ul>
              </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">🏆 Landlord Benefits:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #856404;">
                <li style="margin-bottom: 5px;">Zero listing fees</li>
                <li style="margin-bottom: 5px;">Reach thousands of students</li>
                <li style="margin-bottom: 5px;">Easy booking management</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${config.NODE_ENV === 'production' ? 'https://pgwalebhaiya.com' : 'http://localhost:5173'}/login" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">
                Login to Dashboard
              </a>
              <a href="${config.NODE_ENV === 'production' ? 'https://pgwalebhaiya.com' : 'http://localhost:5173'}/contact" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Contact Support
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                <strong>Need Help?</strong><br>
                📞 WhatsApp: +91 ${config.WHATSAPP_BUSINESS_NUMBER}<br>
                📧 Email: ${config.DEFAULT_ADMIN_EMAIL}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This is an automated welcome email from PG Wale Bhaiya</p>
            <p>© ${new Date().getFullYear()} PG Wale Bhaiya. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(landlordMailOptions);
    
    console.log(`Registration notification emails sent for landlord: ${email}`);
    return true;
    
  } catch (error) {
    console.error('Error sending registration notification:', error);
    return false;
  }
};

// Send landlord login notification
const sendLandlordLoginNotification = async (landlordData) => {
  try {
    const { name, email, phone } = landlordData;
    
    // Email to admin
    const adminMailOptions = {
      from: config.EMAIL_CONFIG.auth.user,
      to: config.DEFAULT_ADMIN_EMAIL,
      subject: '🔐 Landlord Login Activity - PG Wale Bhaiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Landlord Login Activity</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">PG Wale Bhaiya Security Alert</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #343a40; margin-bottom: 20px;">Login Details:</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Landlord Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Phone:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">Login Time:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; color: #0c5460; font-weight: bold;">ℹ️ Information:</p>
              <p style="margin: 5px 0 0 0; color: #0c5460;">This landlord has successfully logged into their dashboard.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This is an automated security notification from PG Wale Bhaiya</p>
            <p>© ${new Date().getFullYear()} PG Wale Bhaiya. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Email to landlord (login confirmation)
    const landlordMailOptions = {
      from: config.EMAIL_CONFIG.auth.user,
      to: email,
      subject: '🔐 Login Successful - PG Wale Bhaiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Login Successful!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Welcome back to PG Wale Bhaiya</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #343a40; margin-bottom: 20px;">Hello ${name}!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
              <p style="margin: 0 0 15px 0; color: #495057; font-size: 16px;">
                You have successfully logged into your PG Wale Bhaiya landlord dashboard.
              </p>
              
              <div style="background: #d4edda; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #155724;">
                  <strong>Login Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${config.NODE_ENV === 'production' ? 'https://pgwalebhaiya.com' : 'http://localhost:5173'}/landlord-dashboard" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-weight: bold;">🔒 Security Notice:</p>
              <p style="margin: 5px 0 0 0; color: #856404; font-size: 14px;">
                If you didn't log in, please contact us immediately at ${config.DEFAULT_ADMIN_EMAIL}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This is an automated login notification from PG Wale Bhaiya</p>
            <p>© ${new Date().getFullYear()} PG Wale Bhaiya. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(landlordMailOptions);
    
    console.log(`Login notification emails sent for landlord: ${email}`);
    return true;
    
  } catch (error) {
    console.error('Error sending login notification:', error);
    return false;
  }
};

// Send PG submission notification
const sendPGSubmissionNotification = async (pgData) => {
  try {
    const { pgTitle, landlordName, landlordEmail, landlordPhone, location, rent, roomType, genderPreference, availableRooms } = pgData;
    
    // Email to admin
    const adminMailOptions = {
      from: config.EMAIL_CONFIG.auth.user,
      to: config.DEFAULT_ADMIN_EMAIL,
      subject: '🏠 New PG Submission - PG Wale Bhaiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏠 New PG Submission</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">PG Wale Bhaiya Admin Panel</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #343a40; margin-bottom: 20px;">PG Details:</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">PG Title:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${pgTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Location:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Room Type:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${roomType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Monthly Rent:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${rent}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Gender Preference:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${genderPreference}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">Available Rooms:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${availableRooms}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
              <h3 style="margin: 0 0 15px 0; color: #343a40;">Landlord Information:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${landlordName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #495057;">Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #6c757d;">${landlordEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">Phone:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${landlordPhone}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; color: #856404; font-weight: bold;">📝 Action Required:</p>
              <p style="margin: 5px 0 0 0; color: #856404;">Please review this PG submission and approve/reject as necessary in the admin panel.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${config.NODE_ENV === 'production' ? 'https://pgwalebhaiya.com' : 'http://localhost:5173'}/admin/dashboard" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Review in Admin Panel
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This is an automated notification from PG Wale Bhaiya</p>
            <p>© ${new Date().getFullYear()} PG Wale Bhaiya. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Email to landlord (submission confirmation)
    const landlordMailOptions = {
      from: config.EMAIL_CONFIG.auth.user,
      to: landlordEmail,
      subject: '🏠 PG Submission Received - PG Wale Bhaiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 PG Submitted Successfully!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Thank you for submitting your PG</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #343a40; margin-bottom: 20px;">Hello ${landlordName}!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
              <p style="margin: 0 0 15px 0; color: #495057; font-size: 16px;">
                Your PG "<strong>${pgTitle}</strong>" has been successfully submitted to PG Wale Bhaiya!
              </p>
              
              <div style="background: #d4edda; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <h3 style="margin: 0 0 10px 0; color: #155724;">📋 Submission Summary:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #155724;">
                  <li style="margin-bottom: 5px;"><strong>Location:</strong> ${location}</li>
                  <li style="margin-bottom: 5px;"><strong>Type:</strong> ${roomType}</li>
                  <li style="margin-bottom: 5px;"><strong>Rent:</strong> ${rent}/month</li>
                  <li style="margin-bottom: 5px;"><strong>For:</strong> ${genderPreference}</li>
                  <li><strong>Available Rooms:</strong> ${availableRooms}</li>
                </ul>
              </div>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
              <h3 style="margin: 0 0 15px 0; color: #084298;">🚀 What Happens Next?</h3>
              <div style="color: #084298;">
                <p style="margin: 0 0 10px 0;"><strong>1. Review Process:</strong> Our admin team will review your submission within 24-48 hours</p>
                <p style="margin: 0 0 10px 0;"><strong>2. Approval:</strong> Once approved, your PG will be visible to thousands of students</p>
                <p style="margin: 0 0 10px 0;"><strong>3. Inquiries:</strong> Start receiving inquiries from interested students</p>
                <p style="margin: 0;"><strong>4. Bookings:</strong> Connect with tenants and close deals easily</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${config.NODE_ENV === 'production' ? 'https://pgwalebhaiya.com' : 'http://localhost:5173'}/landlord-dashboard" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">
                View Dashboard
              </a>
              <a href="${config.NODE_ENV === 'production' ? 'https://pgwalebhaiya.com' : 'http://localhost:5173'}/post-pg" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Submit Another PG
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                <strong>Need Help?</strong><br>
                📞 WhatsApp: +91 ${config.WHATSAPP_BUSINESS_NUMBER}<br>
                📧 Email: ${config.DEFAULT_ADMIN_EMAIL}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This is an automated confirmation email from PG Wale Bhaiya</p>
            <p>© ${new Date().getFullYear()} PG Wale Bhaiya. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(landlordMailOptions);
    
    console.log(`PG submission notification emails sent for: ${pgTitle} by ${landlordName}`);
    return true;
    
  } catch (error) {
    console.error('Error sending PG submission notification:', error);
    return false;
  }
};

// Send cashback request notification
const sendCashbackRequestNotification = async (cashbackData) => {
  try {
    const { fullName, contactInfo, pgName, bookingDate, amountPaid, bookingCode } = cashbackData;
    const adminMailOptions = {
      from: config.EMAIL_CONFIG.auth.user,
      to: 'hello.pgwalebhaiya@gmail.com',
      subject: '💸 New Cashback Request Submitted - PG Wale Bhaiya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💸 New Cashback Request</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">PG Wale Bhaiya Admin Panel</p>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #343a40; margin-bottom: 20px;">Cashback Request Details:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Full Name:</td><td style="padding: 8px 0; color: #6c757d;">${fullName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Contact Info:</td><td style="padding: 8px 0; color: #6c757d;">${contactInfo}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">PG Name:</td><td style="padding: 8px 0; color: #6c757d;">${pgName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Booking Date:</td><td style="padding: 8px 0; color: #6c757d;">${bookingDate}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Amount Paid:</td><td style="padding: 8px 0; color: #6c757d;">₹${amountPaid}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Booking Code:</td><td style="padding: 8px 0; color: #6c757d;">${bookingCode}</td></tr>
            </table>
          </div>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
            <p style="margin: 0; color: #856404; font-size: 14px;">Please review and process this cashback request in the admin panel.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
            <p>This is an automated notification from PG Wale Bhaiya</p>
            <p>© ${new Date().getFullYear()} PG Wale Bhaiya. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(adminMailOptions);
    console.log(`Cashback request notification email sent for: ${fullName} (${contactInfo})`);
    return true;
  } catch (error) {
    console.error('Error sending cashback request notification:', error);
    return false;
  }
};

module.exports = {
  verifyEmailConfig,
  sendLandlordRegistrationNotification,
  sendLandlordLoginNotification,
  sendPGSubmissionNotification,
  sendCashbackRequestNotification
};
