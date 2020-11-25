export default commonData = {
    ToastMessages: {
        no_internet:
            "You're not connected to the internet — try again when you have a good connection.",
        video_no_internet:
            "There was a problem with the network. Try reconnecting again.",
        session_expire:
            "You've been logged out for security purposes, please login again.",
        camera_deny_permission:
            'TalkToMedic needs permission to access your camera to upload photos and for video calls with Experts.',
        verfication_empty: 'Please enter verification code.',
        verfication_error: 'The verification code you entered is incorrect.',
        update_profile: 'Your account has been updated.',
        patient_busy: 'Doctor is not available at the moment. Please try again.',
        doc_busy: 'Patient is not available at the moment. Please try again.',
        tip: 'Thanks for the tip!',
        push_permission:
            'TalkToMedic would like to send you notifications — to continue, tap Settings > Notifications, and turn Notifictions on.',
        push_alert:
            "If you disable push notifications. You won't be able to receive home owner's calls.",
        access_gallery:
            'TalkToMedic need to access your photo library so you can upload photos to your profile or license.',
        access_both_permission:
            'TalkToMedic need to access your camera and microphone for video/audio call.',
        delete_photo: 'Are you sure you want to delete the license picture?',
        max_category:
            'You can select up to three categories — unlock more over time with good reviews.',
        call_timeout: 'All experts are busy — try again in three to five minutes.',
        stripe_connect:
            "You haven't setup your secure Stripe account yet — this is what you need to start receiving calls and get paid.",
        delete_account: 'Are you sure you want to delete your account?',
        ask_refund: 'Do you want a refund?',
        
        card_holder_name: 'Please enter your card holder name.',
        card_last: 'Please enter your card holder last name.',
        valid_card_holder_name: 'Please enter your valid card holder name.',
        card_number: 'Please enter your card number.',
        valid_card: 'Please enter valid card number.',
        expiration: 'Please select your card expiration month/year.',
        cvv: 'Please enter cvv number.',
        zip: 'Please enter zip code.',
        ssn: 'Please enter last four digit of your social.',
        ssn_full: 'Please enter 9 digit of your social.',
        dob: 'Please enter date of birth.',
        age: 'User with minimum 18 years of age can register.',
        email: 'Please enter email.',
        business_type: 'Please select business type.',
        street: 'Please enter address.',
        city: 'Please enter city.',
        state: 'Please enter state.',
        zip_code: 'Please enter zip code.',
        phone_number: 'Please enter mobile number.',
        phone_number_validation: 'Check your phone number and enter it again.',
        update_app_msg:
            'You are using an older version of the app. Please update it to the latest version.',
        full_ssn_prompt:
            'There is error in verifying your SSN. Please add full SSN and resubmit.',
        card_holder_info_error:
            'There is an error in verifying card holder address. Please review your address details and resubmit.',
        pending_verification_msg:
            "Your verification is in progress. To know your status, check Edit Payout Info screen in side menu after sometime.",
        pending_transfered_enable:
            "Your account has been verified successfully. \n Now you can start accepting calls and your earnings will be totally safe. But it may take 1-2 weeks to enable transfers to your card.",
        review_msg:
            "We are currently reviewing your details. Please wait for some time and check again or contact admin if this message persists.",
        refund_msg: 'You request for refund has been initiated. You will hear from us within 2 working days.',

        valid_gender: "Please select gender.",
        first_name: "Please enter first name.",
        phone: "Please enter your mobile number.",
        last_name: "Please enter last name.",
        gender: "Please select gender.",
        password: "Please enter your password.",
        photo: "Please add your profile photo.",
        terms: "Please read and accept the terms and privacy policy.",
        ack: "Please accept the undertaking.",
        state: "Please select state.",
        city: "Please select city.",
        address: "Please enter your address",
        zip: "Please enter PIN code.",
        doc_type: "Please select a document type.",
        doc_front: "Please add photo of document front side.",
        doc_back: "Please add photo of document back side.",

        old_pass: "Please enter your current password.",
        new_pass: "Please enter your new password.",
        confirm_pass: "Please confirm new password.",
        not_match: "New password and Confirm password does not match.",

        mode: "Please select Appointment Mode.",
        purpose: "Please select Appointment Purpose.",

        reg_no: "Please enter registration Number.",
        med_council: "Please select State Medical Council.",
        reg_no: "Please enter registration number.",
        reg_year: "Please enter year of registration.",
        reg_cer: "Please add photo of your registration certificate.",
        qua: "Please enter your highest qualification.",
        prac_name: "Please enter your practice name.",
        prac_add: "Please enter your practice address.",
        praczip: "Please enter PIN code.",
        prac_spec: "Please select your speciality.",
        prac_treat: "Please select treatment areas (multiple).",


        consult_duration: "Please select initial consult duration.",
        consult_fee: "Please enter initial consult fees.",
        follow_duration: "Please select follow-up consult duration.",
        follow_fee: "Please enter follow-up consult fees.",
        consult_slot: "Please select your availability times (multiple).",
    },
    current_version: 1.5,
    latest_version: 1.2,
    connect: '',
    profile_picture_url: 'https://www.talktomedic.in/assets/web/user_images/',
    document_url: "https://www.talktomedic.in/assets/web/user_documents/",
    license_image_url: 'https://www.talktomedic.in/uploads/license/',
    signUpObj: {
        phone_number: '',
        phone_code: '',
        name: '',
        categories: '',
        password: '',
        profile_image: '',
        license_image: '',
        user_type: '',
        device_token: 'asasasasass',
        verification_code: '',
        uuid: '',
    },
    signupParam: new FormData(),
    api_endpoint: {
        change_password: '/users/change_password',
        forgot_password: '/users/forgot_password',
        login: '/users/login',
        signup: '/users/signUp',
        rmpSignup: '/doctors/rmpSignup',
        verfiy_user: '/users/verifyUser',
        update_profile: '/users/edit_profile',
        rmp_update_profile: '/doctors/rmp_edit_profile',
        rmp_get_practice: '/doctors/get-practice-details',
        rmp_add_practice: '/doctors/add_practice_detail',
        consultation_fees: '/doctors/consultation_fees',
        getCities: '/common-details/getCities',
        addMember: '/family/add_member',
        deleteMember: '/family/delete_member',
        getMember: '/family/get_members',
        get_countries: '/common-details',
        get_states: '/states',
        my_appointments: '/appointments',
        cancel_appointments: '/appointments/cancel-appointments',
        payment_receipt: '/payments/payment_receipt',
        payment_receipt_pdf: '/payments/view_receipt',
        medical_history: '/users/medical_history',
        folloUpHistory: "/appointments/followup_history",
        medical_history_by_id: '/appointments/medical_history_byid',
        rmp_medical_history: '/appointments/medical_history',
        getPrescription: '/appointments/view-prescription',
        addPrescription: '/appointments/add_edit_prescription',
        search_doctor: '/doctors/search_rmp',
        search_doctors: '/doctors/search_doctor',
        log_out: '/users/logout',
        user_details: '/users/user_detail',
        verify_phone_code: '/users/verifyPhoneCode',
        book_appointment: '/doctors/book-appointment',
        search_expert: '/users/search_expert',
        add_tip: '/call/add_tip',
        review: '/appointments/review',
        conclude: '/appointments/add-concluding-statement',
        call_history: '/call/call_history',
        add_card: '/payment/add_card',
        get_status: '/stripe/check_keys',
        reject_identity: '/appointments/reject_identity',
        push_payload: '/call/notify_rmp',
        getSession: '/appointments/session-details',
        connect: '/appointments/connect_call',
        refund: '/doctors/refund_amount',
        max_refund_amount: '/doctors/maximum_refund_amount',
        ask_info: '/appointments/ask_info',
        get_availability: '/appointments/get-availability',
        get_availability_new: '/appointments/get_availability_new',
        add_availability: '/appointments/add_availability',
        add_availability_new: '/appointments/add_availability_new',
        missed_by: '/appointments/mark_missedby',
        doctor_availibility: '/appointments/get_availability_by_date',
        pharmacy_otp: '/users/pharmacy_otp',
        general_data: '/common_details/general_slots',
        send_pharm_link: '/users/share_prescription',
        bank_account: '/doctors/add_bank_details',
        get_bank_account: '/doctors/get_bank_details',
        user_complete: '/users/check_completeness',
        get_treatment_byid: '/common-details/get_treatment_byid',
        push_payload_apn: '/call/notify_rmp_apn',
        saveReports: "/appointments/save_reports",
        getAllLabTestReports: "/appointments/show_medical_reports",
        getLabTestReport: "/appointments/getLabTestByAppt",
        deleteLabTestReport: "/appointments/delete_report",
    },
    country_codes: '',
    user_details: { cards: [] },
    user_phone_number: '',
    categories: [],
    stripe_connected_url:
        'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_GWIOqFqwxPtfMRmSy9k3jqCaTjhqfkgQ&always_prompt=true&scope=read_write&redirect_uri=https://www.askkenapp.com/api/public/stripe_connect&state=',

    payment_card_details: {},
    push_payload: '',
    manual_end_uuid: '',
    stripe_status: {
        charge_enabled: 0,
        errors: [],
        transfer_enabled: 0
    },


    patient_account_items: [{
        id: '1',
        item_name: "Book Appointment",
        icon: 'md-text',
        show_separator: false
    },
    {
        id: '2',
        item_name: "Appointments",
        icon: "ios-calendar",
        show_separator: false
    },
    {
        id: '3',
        item_name: "Medical History/ Prescriptions",
        icon: "ios-list-box",
        show_separator: false
    },
    {
        id: '10',
        item_name: "Lab Test/ Reports",
        icon: "ios-list-box",
        show_separator: false
    },
    {
        id: '4',
        item_name: "Payment Receipts",
        icon: "ios-list",
        show_separator: true
    },
    {
        id: '5',
        item_name: "Edit Profile",
        icon: "ios-person",
        show_separator: false
    },

    {
        id: '6',
        item_name: "Family Member",
        icon: "ios-person-add",
        show_separator: true
    },
    {
        id: '7',
        item_name: "Audio/Video Settings",
        icon: "ios-settings",
        show_separator: false
    },
    {
        id: '8',
        item_name: "Change Password",
        icon: "ios-create",
        show_separator: false
    },
    {
        id: '9',
        item_name: "Logout",
        icon: "ios-power",
        show_separator: false
    }

    ],

    rmp_account_items: [
        {
            id: '2',
            item_name: "My Appointments",
            icon: "ios-calendar",
            show_separator: false
        },
        {
            id: '1',
            item_name: "Manage Availability",
            icon: 'ios-timer',
            show_separator: false
        },
        {
            id: '6',
            item_name: "Practice Details",
            icon: "ios-list-box",
            show_separator: false
        },

        {
            id: '4',
            item_name: "Manage Bank Details",
            icon: "md-cash",
            show_separator: false
        },
        {
            id: '3',
            item_name: "My Earnings",
            icon: "ios-cash",
            show_separator: true
        },
        {
            id: '5',
            item_name: "Edit Profile",
            icon: "ios-person",
            show_separator: false
        },


        {
            id: '8',
            item_name: "Audio/Video Settings",
            icon: "ios-settings",
            show_separator: false
        },
        {
            id: '9',
            item_name: "Change Password",
            icon: "ios-create",
            show_separator: false
        },
        {
            id: '10',
            item_name: "Logout",
            icon: "ios-power",
            show_separator: false
        }

    ],


    problems: [{
        name: 'Arthritis',
        id: 1
    },
    {
        name: 'COVID19',
        id: 2
    },
    {
        name: 'General Physician',
        id: 3
    },
    {
        name: 'Heart Disease',
        id: 4
    },
    {
        name: 'Menopause',
        id: 5
    },
    {
        name: 'Orthopedics-Bone',
        id: 6
    },
    {
        name: 'Preganacy ',
        id: 7
    }
        ,
    {
        name: 'Skin Problem',
        id: 8
    }
    ]
};
