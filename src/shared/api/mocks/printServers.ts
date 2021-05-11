/**
 * Created by Aleksandr on 22.05.2017.
 */
const printServers = {
    items: [
        {
            a3Price: 0,
            a4Price: 0,
            a5Price: 0,
            colorCoeff: 0,
            driver: "network driver1",
            duplexCoeff: 0,
            followme: false,
            host: {
                active: false,
                groups: [],
                hostType: "network",
                id: 1,
                ip: "192.168.1.1",
                mac: "print-server-mac-1",
                name: "Print server 1",
                status: false,
                version: "1"
            },
            id: 1,
            ignore: false,
            jobCount: 0,
            name: "network-printer1",
            pageCount: 0,
            price: 0,
            printerGroups: [{id: 1, name: "default", jobCount: 0, pageCount: 0, type: true}],
            printerIp: null,
            printerType: "network",
            removed: false,
            snmpData: {},
            synced: false
        },
        {
            a3Price: 0,
            a4Price: 0,
            a5Price: 0,
            colorCoeff: 0,
            driver: "network driver2",
            duplexCoeff: 0,
            followme: false,
            host: {
                active: false,
                groups: [],
                hostType: "network",
                id: 1,
                ip: "192.168.1.2",
                mac: "print-server-mac-2",
                name: "Print server 2",
                status: false,
                version: "1"
            },
            id: 1,
            ignore: false,
            jobCount: 0,
            name: "network-printer2",
            pageCount: 0,
            price: 0,
            printerGroups: [{id: 1, name: "default", jobCount: 0, pageCount: 0, type: true}],
            printerIp: null,
            printerType: "network",
            removed: false,
            snmpData: {},
            synced: false
        },
        {
            a3Price: 0,
            a4Price: 0,
            a5Price: 0,
            colorCoeff: 0,
            driver: "network driver3",
            duplexCoeff: 0,
            followme: false,
            host: {
                active: false,
                groups: [],
                hostType: "network",
                id: 1,
                ip: "192.168.1.3",
                mac: "print-server-mac-3",
                name: "Print server 3",
                status: false,
                version: "1"
            },
            id: 1,
            ignore: false,
            jobCount: 0,
            name: "network-printer3",
            pageCount: 0,
            price: 0,
            printerGroups: [{id: 1, name: "default", jobCount: 0, pageCount: 0, type: true}],
            printerIp: null,
            printerType: "network",
            removed: false,
            snmpData: {},
            synced: false
        }
    ],
    aggregate: {
        totalItems: 3,
        totalPages: 1,
        totalJobs: 0
    },
};

const syncUnsyncPrinters = {
  sync: ['printer1', 'printer3', 'printer5'],
  unsync: ['printer2', 'printer6', 'printer7', 'printer8', 'printer9'],
};

const syncUnsyncCatalogs = {
    sync: ['catalog1', 'catalog3', 'catalog5'],
    unsync: ['catalog2', 'catalog6', 'catalog7', 'catalog8', 'catalog9'],
};

const printServersFiltersMock = {
    filters: [
        { param: 'username', type: 'value_filter' },
        { param: 'ip', type: 'value_filter' },
    ],
};

export {
    printServers,
    printServersFiltersMock,
    syncUnsyncPrinters,
    syncUnsyncCatalogs
}