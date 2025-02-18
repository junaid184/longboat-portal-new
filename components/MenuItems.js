import homeIcon from '../assets/images/icons/homeIcon.png';
import orderIcon from '../assets/images/icons/order.png';
import fulfillOrder from '../assets/images/fulfillment.png';
import totalOrder from '../assets/images/order-fulfillment.png';
import eventIcon from '../assets/images/events.png';
import inventoryIcon from '../assets/images/inventory.png';
import proxiesIcon from '../assets/images/proxy.png';
import userIcon from '../assets/images/users.png';
import pendingOrder from '../assets/images/box.png';
import activeOrder from '../assets/images/online.png';
import badEventsIcon from '../assets/images/badEvents.png';
import offerIcon from '../assets/images/offer.png';
import newOrderIcon from '../assets/images/newOrder.png';
import bulkIcon from '../assets/images/bulkIcon.png';

export default {
    admin: [
        {
            url: '/admin',
            title: 'Home',
            icon: homeIcon,
        },
        {
            url: '/admin/orders',
            title: 'Orders',
            icon: orderIcon,
        },
        
        {
            url: '/admin/events',
            title: 'Events',
            icon: eventIcon
        },
        {
            url: '/admin/newOrder',
            title: 'New Order',
            icon: newOrderIcon
        },
        {
            url: '/admin/bulkEvents',
            title: 'Bulk Events',
            icon: bulkIcon
        },
        {
            url: '/admin/badEvents',
            title: 'Bad Events',
            icon: badEventsIcon
        },
        {
            url: '/admin/inventory',
            title: 'Inventory',
            icon: inventoryIcon
        },
        {
            url: '/admin/users',
            title: 'Users',
            icon: userIcon
        },
        {
            url: '/admin/buyingAccount',
            title: 'Buying Accounts',
            icon: userIcon
        },
        {
            url: '/admin/offers',
            title: 'Offers',
            icon: offerIcon,
        },
        {
            url: '/admin/proxies',
            title: 'Proxies',
            icon: proxiesIcon
        },
    ],
    admin1: [
        {
            url: '',
            title: 'Fulfilled Orders',
            icon: fulfillOrder,
            count: 10,
        },
        {
            url: '',
            title: 'Total Orders',
            icon: totalOrder,
            count: 50,
        },
        {
            url: '',
            title: 'Pending Orders',
            icon: pendingOrder,
            count: 40,
        },
        {
            url: '',
            title: 'Active Orders',
            icon: activeOrder,
            count: 25,
        },
    ],
    admin2: [
        {
            url: '/admin/events',
            title: 'Total Events',
            icon: fulfillOrder,
            count: 10,
        },
        {
            url: '',
            title: 'Broadcast Events',
            icon: pendingOrder,
            count: 50,
        },
        {
            url: '',
            title: 'Unbroadcast Events',
            icon: totalOrder,
            count: 30,
        
        },
        {
            url: '/admin/badEvents',
            title: 'Bad Events',
            icon: badEventsIcon,
            count: 40,
        }
    ],
    admin3: [
        {
            url: '/admin/inventory',
            title: 'Inventory',
            icon: inventoryIcon
        },
    ]
}