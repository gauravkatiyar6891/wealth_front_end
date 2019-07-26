export class ErrorResponse {

  public static TOKEN_EXPIRE = 'io.jsonwebtoken.ExpiredJwtException';
  public static SERVER_NOT_RESPOND = "Server Not Respond!";
  public static INVALID_CREDENTIAL = "Your Password is Incorrect";
  public static UNAUTHORIZED = 'Access Denied!';
  public static PAGE_NOT_FOUND = '404 Page Not Found';
  public static INTERNAL_SERVER_ERROR = 'Something went wrong, please try again!';
  public static INVALID_OTP = 'Invalid Otp';
  public static OTP_EXPIRED = 'Otp has been expired.';
  public static DATA_NOT_FOUND = 'Data not found, please try with another values !';
  public static TOP_SCHEMES_DATA_NOT_FOUND = 'Recommended Scheme Not Found !';
  public static SELECT_EXCEL_FILE = 'File not found, please select excel file to upload !';
  public static ONBOARDING_COMPLETED_SUCCESSFULLY='Onboarding Completed Successfully';
  public static BLOGS_NOT_FOUND = 'Blogs not found !';
  public static CATEGORY_SAVED = 'Category Saved Successfully !';
  public static DATA_NOT_SAVED = 'Category Not Saved !';
  public static CATEGORY_NOT_FOUND = 'Category Not Found Please Add The Category First !';
  public static BLOG_UPLOADED_SECCESSFULLY = 'Blog Uploaded Successfully !';
  public static PLEASE_CHECK_EMAIL = 'Email has send , Please check your email !';
  public static PLEASE_CHOOSE_IMAGE='Please choose image to upload !';
  public static USER_DELETED_SUCCESSFULLY='User deleted successfully !';
  public static PORT_FOLIO_DATA_NOT_FOUND='You do not have done any transaction yet !';
  public static TRANSACTION_DATA_NOT_FOUND='You do not have done any transaction yet !';
  public static AMOUNT_NOT_FOUND='Amount can not be bull or zero !';
  public static NAV_DETAIL_NOT_AVAILABLE = 'Something went wrong please selelct other scheme';
  public static USER_NOT_VERIFY ='Please verify your mobile first .'
  public static USER_NOT_REGISTER_WITH_MOBILE = 'The phone number that you have entered does not match any account. please register first';
  public static CATEGORY_ALREADY_EXISTS = 'This category name is already exists please try with different name !';
  public static DATA_UPDATED_SECCESSFULLY = 'Seo data Updated Successfully !';
  public static SELECT_VIDEO_FILE = 'File not found, please select video to upload !';
  public static DATA_UPDATED = 'Update Successfully !';
  public static MAIL_SENT_SUCCESSFULLY='Mail sent successfully.';

  /** Mandate Response  **/
  public static APPROVED='Approved';
  
  public static REGISTERED_BY_MEMBER='You have successfully applied for E-Mandate. However, you have not completed your e-mandate authentication process with BSEStar-MF to make monthly SIP installment automate from your Bank Account. Please authenticate e-mandate process by Clicking Here OR by steps mentioned in email received from BSEStar-MF as subject line "BSE StARMF EMandate Authentication Link".  However, you can still register your X-SIP and place the order.Please contact system administrator for more info';

  public static UNDER_PROCESSING='Your e-mandate process is under processing but you can still start investing.';
  public static RECEIVED_BY_SPONSOR_BANK='Your e-mandate process is under processing but you can still start investing.';
  public static APPROVED_BY_SPONSOR_BANK='Your e-mandate process is under processing but you can still start investing.';
  
  public static REJECTED='Your e-mandate process is rejected by BSE Star MF due to some reason now you can change your bank information and can start again onboarding process.';
  public static INITIAL_REJECTION='Your e-mandate process is rejected by BSE Star MF due to some reason now you can change your bank information and can start again onboarding process.';
  public static REJECTION_AT_NPCI_PRIOR_TO_DESTINATION_BANK='Your e-mandate process is rejected by BSE Star MF due to some reason now you can change your bank information and can start again onboarding process.';
  public static REJECTED_BY_SPONSOR_BANK='Your e-mandate process is rejected by BSE Star MF due to some reason now you can change your bank information and can start again onboarding process.';
  public static CANCELLED_BY_INVESTOR='Your e-mandate process is rejected by BSE Star MF due to some reason now you can change your bank information and can start again onboarding process.';
  public static RETURNED_BY_EXCHANGE = 'Your e-mandate process is rejected by BSE Star MF due to some reason now you can change your bank information and can start again onboarding process.';
  
}