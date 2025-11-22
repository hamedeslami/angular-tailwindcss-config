export const users = [
    {
        id: 'DE124321',
        user: {
            initials: 'ح ا',
            name: 'حامد اسلامی',
            email: 'johndoe@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Software License',
            price: '$18,50.34',
            purchaseDate: '2024-06-15',
        },
        status: { type: 'Complete', text: 'فعال' },
        actions: { delete: true },
    },
    {
        id: 'DE124322',
        user: {
            initials: 'CD',
            name: 'Jane Smith',
            email: 'janesmith@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Cloud Hosting',
            price: '$12,99.00',
            purchaseDate: '2024-06-18',
        },
        status: { type: 'Pending', text: 'معلق' },
        actions: { delete: true },
    },
    {
        id: 'DE124323',
        user: {
            initials: 'EF',
            name: 'Michael Brown',
            email: 'michaelbrown@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Web Domain',
            price: '$9,50.00',
            purchaseDate: '2024-06-20',
        },
        status: { type: 'Cancel', text: 'غیرفعال' },
        actions: { delete: true },
    },
    {
        id: 'DE124324',
        user: {
            initials: 'GH',
            name: 'Alice Johnson',
            email: 'alicejohnson@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'SSL Certificate',
            price: '$2,30.45',
            purchaseDate: '2024-06-25',
        },
        status: { type: 'Pending', text: 'معلق' },
        actions: { delete: true },
    },
    {
        id: 'DE124325',
        user: {
            initials: 'IJ',
            name: 'Robert Lee',
            email: 'robertlee@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Premium Support',
            price: '$15,20.00',
            purchaseDate: '2024-06-30',
        },
        status: { type: 'Complete', text: 'فعال' },
        actions: { delete: true },
    },
    {
        id: 'DE124321',
        user: {
            initials: 'ح ا',
            name: 'حامد اسلامی',
            email: 'johndoe@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Software License',
            price: '$18,50.34',
            purchaseDate: '2024-06-15',
        },
        status: { type: 'Complete', text: 'فعال' },
        actions: { delete: true },
    },
    {
        id: 'DE124322',
        user: {
            initials: 'CD',
            name: 'Jane Smith',
            email: 'janesmith@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Cloud Hosting',
            price: '$12,99.00',
            purchaseDate: '2024-06-18',
        },
        status: { type: 'Pending', text: 'معلق' },
        actions: { delete: true },
    },
    {
        id: 'DE124323',
        user: {
            initials: 'EF',
            name: 'Michael Brown',
            email: 'michaelbrown@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Web Domain',
            price: '$9,50.00',
            purchaseDate: '2024-06-20',
        },
        status: { type: 'Cancel', text: 'غیرفعال' },
        actions: { delete: true },
    },
    {
        id: 'DE124324',
        user: {
            initials: 'GH',
            name: 'Alice Johnson',
            email: 'alicejohnson@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'SSL Certificate',
            price: '$2,30.45',
            purchaseDate: '2024-06-25',
        },
        status: { type: 'Pending', text: 'معلق' },
        actions: { delete: true },
    },
    {
        id: 'DE124325',
        user: {
            initials: 'IJ',
            name: 'Robert Lee',
            email: 'robertlee@gmail.com',
        },
        avatarColor: 'blue',
        product: {
            name: 'Premium Support',
            price: '$15,20.00',
            purchaseDate: '2024-06-30',
        },
        status: { type: 'Complete', text: 'فعال' },
        actions: { delete: true },
    },
];

export const columns = [
      { key: 'id', label: 'Deal ID' },
      { key: 'user', label: 'Customer', templateName: 'userTemplate' },
      { key: 'product.name', label: 'Product/Service' },
      { key: 'product.price', label: 'Deal Value' },
      { key: 'product.purchaseDate', label: 'Close Date' },
      { key: 'status', label: 'Status', templateName: 'statusTemplate' },
      { key: 'actions', label: 'Actions', templateName: 'actionTemplate' },
    ];