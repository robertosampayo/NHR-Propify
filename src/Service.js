const networkError = () => Math.floor(Math.random() * Math.floor(5)) === 0;

const randomResponseTime = () => Math.floor(Math.random() * Math.floor(1000));

function randomDate() {
  const start = 1609459200000;
  const end = 1640995199000;
  const date = new Date(+start + Math.random() * (end - start));
  date.setHours(0);
  return date.toISOString();
}

function randomPaymentStatus() {
  return ['CURRENT', 'LATE'][Math.floor(Math.random() * 2)];
}

let tenants = [
  {
    id: 1,
    name: 'Fahad Ryder',
    paymentStatus: randomPaymentStatus(),
    leaseEndDate: randomDate()
  },
  {
    id: 2,
    name: 'Lucinda Busby',
    paymentStatus: randomPaymentStatus(),
    leaseEndDate: randomDate()
  },
  {
    id: 3,
    name: 'Ameen Hammond',
    paymentStatus: randomPaymentStatus(),
    leaseEndDate: randomDate()
  },
  {
    id: 4,
    name: 'Emrys Mcguire',
    paymentStatus: randomPaymentStatus(),
    leaseEndDate: randomDate()
  },
  {
    id: 5,
    name: 'Tamar Robertson',
    paymentStatus: randomPaymentStatus(),
    leaseEndDate: randomDate()
  }
];

const valid = (tenant) => {
  return !!tenant.name && tenant.name.length <= 25 && !!tenant.paymentStatus && !!tenant.leaseEndDate;
}

let nextId = 6;

const deleteTenant = (id) => {
  tenants = tenants.filter(tenant => tenant.id !== id);
}

export const Service = {
  getTenants: () => {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        networkError() ? reject("Network Error!") : resolve([...tenants]);
      }, randomResponseTime());
    });
  },
  addTenant: (tenant) => {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        if (!valid(tenant)) {
          reject("Invalid payload");
        }
        if (networkError()) {
          reject("Network Error!");
        } else {
          tenant.id = nextId++;
          tenants.push(tenant);
          resolve({...tenant});
        }
      }, randomResponseTime());
    });
  },
  deleteTenant: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        if (networkError()) {
          reject("Network Error!")
        } else {
          deleteTenant(id);
          resolve('OK')
        }
      }, randomResponseTime());
    });
  }
}
