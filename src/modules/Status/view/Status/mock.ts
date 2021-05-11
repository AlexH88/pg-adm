export let pieData1 = {
  datasets: [{
    data: [
      100,
      100,
      100,
      100,
      100,
    ],
    backgroundColor: [
      "rgb(54, 162, 235)",
      "rgb(75, 192, 192)",
      "rgb(255, 99, 132)",
      "rgb(255, 205, 86)",
      "rgb(169, 243, 164)",
    ],
    label: 'Dataset 1'
  }],
  labels: [
    "test",
    "new_group",
    "users",
    "admins",
    "guests"
  ]
};

export let pieData2 = {
  datasets: [{
    data: [
      200,
      100,
      430,
      98,
      360,
    ],
    backgroundColor: [
      "rgb(54, 162, 235)",
      "rgb(75, 192, 192)",
      "rgb(255, 99, 132)",
      "rgb(255, 205, 86)",
      "rgb(169, 243, 164)",
    ],
    label: 'Dataset 1'
  }],
  labels: [
    "hp",
    "canon",
    "lexmark",
    "toshiba",
    "unknown"
  ]
};

export let lineData1 = {
  datasets: [
    {
      data:[100, 200, 300, 200, 180, 377, 490, 560, 99, 88, 10, 156],
      label: 'test',
      fill: false,
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgb(54, 162, 235)'
    }
  ],
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};
