// Create
const btnShowModalCreate = $('#btnShowModalCreate');
const formCreate = $('#formCreate');
const modalCreate = $('#modalCreate');
const btnCreate = $('#btnCreate');
const fullNameCreate = $('#fullNameCreate');
const emailCreate = $('#emailCreate');
const phoneCreate = $('#phoneCreate');
const addressCreate = $('#addressCreate');

// Update
const modalUpdate = $('#modalUpdate');
const formUpdate = $('#formUpdate');
const addressUpdate = $('#addressUpdate');
const fullNameUpdate = $('#fullNameUpdate');
const emailUpdate = $('#emailUpdate');
const phoneUpdate = $('#phoneUpdate');
const btnUpdate = $('#btnUpdate');

// Deposit
const btnDeposit = $('#btnDeposit');
const modalDeposit = $('#modalDeposit');
const formDeposit = $('#formDeposit');
const idDeposit = $('#idDeposit');
const fullNameDeposit = $('#fullNameDeposit');
const emailDeposit = $('#emailDeposit');
const balanceDeposit = $('#balanceDeposit');
const transactionAmountDeposit = $('#amountDeposit');

// Withdraw
const btnWithdraw = $('#btnWithdraw');
const modalWithdraw = $('#modalWithdraw');
const formWithdraw = $('#formWithdraw');
const idWithdraw = $('#idWithdraw');
const fullNameWithdraw = $('#fullNameWithdraw');
const emailWithdraw = $('#emailWithdraw');
const balanceWithdraw = $('#balanceWithdraw');
const transactionAmountWithdraw = $('#amountWithdraw');

// Transfer
const btnTransfer = $('#btnTransfer');
const modalTransfer = $('#modalTransfer');
const formTransfer = $('#formTransfer');

//History

const btnHistory = $('#btnHistory');
const modalHistory = $('#modalHistory');
const strBody = $('#tbCustomerBody');
const strHistoryBody = $('#tbHistoryBody')

let customers = [];
let customer = new Customer();


// pagination and search

const itemsPerPage = 2; // Số lượng khách hàng trên mỗi trang
let currentPage = 1;

function initializePage() {
    currentPage = 1; // Đặt trang ban đầu là trang 1

    refreshCustomerList();
}

function refreshCustomerList() {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    const filteredCustomers = customers.filter(customer => {
        const searchQuery = $('#searchInput').val().toLowerCase();
        return customer.fullName.toLowerCase().includes(searchQuery);
    });

    strBody.empty();
    for (let i = startIdx; i < Math.min(endIdx, filteredCustomers.length); i++) {
        const str = renderCustomer(filteredCustomers[i]);
        $(strBody).append(str);
    }

    // Cập nhật thông tin phân trang
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    $('.pageButton_').remove();
    // $('.pagination').append('<button class="pageButton">Previous</button>');
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = $(`<button class ="pageButton_">${i}</button>`);
        pageButton.click(function () {
            // Xử lý sự kiện khi người dùng chọn trang
            currentPage = i;

            $('#currentPage button.pageButton').addClass("active");
            // document.getElementById("currentPage").textContent = currentPage;
            refreshCustomerList();
        });
        $('#currentPage').append(pageButton);
    }
    // $('.pagination').append('<button class="pageButton">Next</button>');

    $('#pageInfo').text(`Page ${currentPage} of ${totalPages}`);
    $('#prevPage').prop('disabled', currentPage === 1);
    $('#nextPage').prop('disabled', currentPage === totalPages);
}

// Bắt sự kiện khi ấn nút Previous
$('#prevPage').on('click', () => {
    if (currentPage > 1) {
        currentPage--;
        $('#currentPage button.pageButton').addClass("active");
        refreshCustomerList();
    }
});

$('#nextPage').on('click', () => {
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        $('#currentPage button.pageButton').addClass("active");
        refreshCustomerList();
    }
});

// Bắt sự kiện khi ấn nút Search
$('#searchButton').on('click', () => {
    currentPage = 1;
    // document.getElementById("currentPage").textContent = currentPage;
    refreshCustomerList();
});

// Khởi chạy với danh sách ban đầu
refreshCustomerList();


const renderCustomer = (obj) => {
    return `
            <tr id="tr_${obj.id}">
                <td>${obj.id}</td>
                <td>${obj.fullName}</td>
                <td>${obj.email}</td>
                <td>${obj.phone}</td>
                <td>${obj.address}</td>
                <td>${obj.balance}</td>
                <td>
                    <button title = "Edit" class="btn btn-outline-secondary edit" data-id="${obj.id}">
                        <i class="fas fa-user-edit"></i>
                    </button>
                </td>
                <td>
                    <button title = "Deposit" class="btn btn-outline-success deposit" data-id="${obj.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </td>
                <td>
                    <button title = "Withdraw" class="btn btn-outline-warning withdraw" data-id = "${obj.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                </td>
                <td>
                    <button title = "Transfer" class="btn btn-outline-primary transfer" data-id = "${obj.id}">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                </td>
                <td>
                    <button title = "Delete" class="btn btn-outline-danger delete" data-id="${obj.id}">
                        <i class="fas fa-user-slash"></i>
                    </button>
                </td>
            </tr>
            `;
}
const renderNameCus = (obj) => {
    return `
                <option value="${obj.id}">${obj.fullName}</option>
            `
}

const getAllCustomers = () => {
    const loadingToast = webToast.loading({
        status: 'Loading...', message: 'Fetching customer data', align: 'bottomright', line: true,
    });

    return $.ajax({
        type: 'GET',
        url: "http://localhost:8080/api/customers",
        success: function (response) {
            customers = response;
            strBody.empty();

            $.each(response, (index, item) => {
                const str = renderCustomer(item);
                $(strBody).append(str);
            })
            refreshCustomerList();
            // initializePage();
            loadingToast.remove();
        }, error: function () {
            alert('Error');
        }
    });
}

const createCustomer = () => {
    btnCreate.attr('disable', true);

    let load = webToast.loading({
        status: 'Loading...', message: 'Please wait a moment', align: 'bottomright', line: true,
    });

    customer.id = null;
    customer.fullName = fullNameCreate.val();
    customer.email = emailCreate.val();
    customer.phone = phoneCreate.val();
    customer.address = addressCreate.val();
    customer.balance = 0;

    $.ajax({
        headers: {
            'accept': 'application/json', 'content-type': 'application/json',
        },
        type: 'POST',
        url: "http://localhost:8080/api/customers",
        data: JSON.stringify(customer)
    })
        .done((data) => {
            // Cập nhật danh sách khách hàng
            customers.push(data);

            // Hiển thị khách hàng vừa thêm
            const str = renderCustomer(data);
            $(strBody).append(str);

            modalCreate.modal('hide');

            webToast.Success({
                status: 'Thêm mới thành công', message: '', delay: 2000, align: 'topright'
            });

            // Cập nhật trang web
            refreshCustomerList();
        })
        .fail((error) => {
            console.log(error);
        })
        .always(() => {
            btnCreate.attr('disable', false);
            load.remove();
        });
}


const showUpdate = () => {
    $('#tbCustomerBody').on('click', '.edit', function () {
        const id = $(this).data('id');

        $.ajax({
            url: "http://localhost:8080/api/customers/" + id
        })
            .done((data) => {
                if (Object.keys(data).length > 0) {
                    $('#idUpdate').val(data.id);
                    $('#fullNameUpdate').val(data.fullName);
                    $('#emailUpdate').val(data.email);
                    $('#addressUpdate').val(data.address);
                    $('#phoneUpdate').val(data.phone);
                    console.log(data)
                    $('#modalUpdate').modal('show');
                } else {
                    alert('Cant find any Customer with that ID');
                }
            })
            .fail((error) => {
                console.log(error);
            })
        $('#searchInput').prop('readonly', true)
    })
}

const updateCustomer = () => {
    btnUpdate.attr('disabled', true);

    const customerId = $('#idUpdate').val();

    let load = webToast.loading({
        status: 'Loading...', message: 'Please wait a moment...', align: 'bottomright', line: true,
    });

    customer.id = customerId;
    customer.fullName = fullNameUpdate.val();
    customer.email = emailUpdate.val();
    customer.phone = phoneUpdate.val();
    customer.address = addressUpdate.val();
    // customer.balance = 0;

    setTimeout(() => {
        $.ajax({
            headers: {
                'accept': 'application/json', 'content-type': 'application/json'
            }, type: 'PATCH', url: "http://localhost:8080/api/customers/" + customerId, data: JSON.stringify(customer)
        })
            .done((data) => {
                const str = renderCustomer(data);
                const currentRow = $('#tr_' + customerId);
                currentRow.replaceWith(str);

                $('#modalUpdate').modal('hide');

                webToast.Success({
                    status: 'Cập nhật thành công!', message: '', delay: 2000, align: 'topright'
                });
            })
            .fail((error) => {
                console.log(error);
            })
            .always(() => {
                btnUpdate.attr('disabled', false);
                load.remove();
            })
    }, 1000);
};

const deleteCustomer = () => {
    $('#tbCustomerBody').on('click', '.delete', function () {
        const id = $(this).data('id');
        const fullName = $(`#tr_${id} td:nth-child(2)`).text();

        const confirmBox = webToast.confirm("Are you sure you want to delete customer " + fullName + "?");
        confirmBox.click(function () {
            confirmBox.attr('disabled', true);

            let load = webToast.loading({
                status: 'Loading...', message: 'Please Wait a moment', align: 'bottomright', line: true,
            });

            customer.id = id;
            const currentPageBeforeDelete = currentPage

            setTimeout(() => {
                $.ajax({
                    headers: {
                        'accept': 'application/json', 'content-type': 'application/json'
                    }, type: 'DELETE', url: "http://localhost:8080/api/customers/" + id, data: JSON.stringify(customer)
                })
                    .done(() => {
                        webToast.Success({
                            status: 'Xóa thành công', message: '', delay: 2000, align: 'topright'
                        });
                        const currentRow = $(`#tr_${id}`);
                        currentRow.remove();

                        // Không cần gọi lại getAllCustomers() ở đây
                        // Ta chỉ cần cập nhật lại trang hiển thị
                        currentPage = currentPageBeforeDelete;
                        refreshCustomerList();
                    })
                    .fail((error) => {
                        console.log(error);
                    })
                    .always(() => {
                        getAllCustomers();
                        confirmBox.attr('disabled', false);
                        load.remove();
                    });
            }, 1000);
        });
    });
}

const getCustomerById = (id) => {
    return $.ajax({
        url: "http://localhost:8080/api/customers/" + id
    })
}

const showDeposit = () => {
    $('#tbCustomerBody').on('click', '.deposit', function () {
        const id = $(this).data('id');
        getCustomerById(id).then((data) => {
            customer = data;

            formDeposit.trigger('reset');
            idDeposit.val(customer.id);
            fullNameDeposit.val(customer.fullName);
            emailDeposit.val(customer.email);
            balanceDeposit.val(customer.balance);

            modalDeposit.modal('show');
        }).catch((error) => {
            console.log(error);

            webToast.Danger({
                status: 'Không tồn tại dữ liệu khách hàng', message: '', delay: 2000, align: 'topright'
            });
        })
    });
}

const deposit = () => {
    const obj = {
        customerId: idDeposit.val(), transactionAmount: transactionAmountDeposit.val()
    }

    $.ajax({
        headers: {
            'accept': 'application/json', 'content-type': 'application/json'
        }, type: 'POST', url: "http://localhost:8080/api/customers/deposit", data: JSON.stringify(obj)
    })
        .done((data) => {
            modalDeposit.modal('hide');

            const str = renderCustomer(data);
            $('#tr_' + obj.customerId).replaceWith(str);

            webToast.Success({
                status: 'Nạp tiền vào tài khoản thành công!', message: '', delay: 2000, align: 'topright'
            });
        })
}

const showWithdraw = () => {
    $('#tbCustomerBody').on('click', '.withdraw', function () {
        const id = $(this).data('id');
        getCustomerById(id).then((data) => {
            customer = data;

            formWithdraw.trigger('reset');
            idWithdraw.val(customer.id);
            fullNameWithdraw.val(customer.fullName);
            emailWithdraw.val(customer.email);
            balanceWithdraw.val(customer.balance);

            modalWithdraw.modal('show');
        }).catch((error) => {
            console.log(error);

            webToast.Danger({
                status: 'Không tồn tại dữ liệu khách hàng', message: '', delay: 2000, align: 'topright'
            });
        })
    });
}

const withdraw = () => {
    const obj = {
        customerId: idWithdraw.val(), transactionAmount: transactionAmountWithdraw.val()
    }

    $.ajax({
        headers: {
            'accept': 'application/json', 'content-type': 'application/json'
        }, type: 'POST', url: "http://localhost:8080/api/customers/withdraw", data: JSON.stringify(obj)
    })
        .done((data) => {
            modalWithdraw.modal('hide');

            const str = renderCustomer(data);
            $('#tr_' + obj.customerId).replaceWith(str);

            webToast.Success({
                status: 'Rút tiền từ tài khoản thành công!', message: '', delay: 2000, align: 'topright'
            });
        })
}

const showTransfer = () => {
    $('#tbCustomerBody').on('click', '.transfer', function () {
        const id = $(this).data('id');

        getCustomerById(id)
            .done((data) => {
                if (Object.keys(data).length) {
                    $('#senderName').val(data.fullName);
                    $('#idSender').val(data.id);
                    $('#emailSender').val(data.email);
                    $('#balanceSender').val(data.balance);
                    $('#fee').val(10);

                    const strSelect = $('#recipient');
                    $('#amountTransfer').on('input', () => {
                        let fee = parseFloat($('#fee').val());
                        let totalAmount = Math.round(parseFloat($('#amountTransfer').val()) * (1 + fee / 100));
                        $('#totalAmount').val(totalAmount);
                    })

                    let filteredCustomers = customers.filter(function (item) {
                        return item.id !== id;
                    });

                    strSelect.empty();

                    $.each(filteredCustomers, function (index, item) {
                        let str = renderNameCus(item);
                        strSelect.append(str);
                    });
                    $('#modalTransfer').modal('show');
                } else {
                    alert('Cant do anything!');
                }
            }).fail((error) => {
            console.log(error);
        })
    });
}

const transfer = () => {
    const senderId = $('#idSender').val();
    const recipientId = $('#recipient').val();
    const transferAmount = $('#amountTransfer').val();

    btnTransfer.attr('disabled', true);

    let load = webToast.loading({
        status: 'Loading...', message: 'Please Wait a moment', align: 'bottomright', line: true,
    });

    const transfer = {
        senderId: senderId, recipientId: recipientId, transferAmount: transferAmount
    }

    setTimeout(() => {
        $.ajax({
            headers: {
                'accept': 'application/json', 'content-type': 'application/json'
            }, type: 'POST', url: "http://localhost:8080/api/customers/transfer", data: JSON.stringify(transfer)
        })
            .done((data) => {
                const strSender = renderCustomer(data.sender);
                const currentRow = $('#tr_' + senderId);
                currentRow.replaceWith(strSender);

                const strRecipient = renderCustomer(data.recipient);
                const currentRowR = $('#tr_' + recipientId);
                currentRowR.replaceWith(strRecipient);

                modalTransfer.modal('hide');

                webToast.Success({
                    status: 'Chuyển tiền thành công!', message: '', delay: 2000, align: 'topright'
                });
            })
            .always(() => {
                btnTransfer.attr('disabled', false);
                load.remove();
            })
    }, 1000);
}


const history = () => {
    return $.ajax({
        type: 'GET',
        url: "http://localhost:8080/api/customers/histories",
        success: function (response) {
            strHistoryBody.empty();
            $.each(response, (index, item) => {
                const str = renderHistory(item);
                $(strHistoryBody).append(str);
            })
        }, error: function () {
            alert('Error');
        }
    })
}
const renderHistory = (item) => {
    const transactionDate = new Date(item.transactionDate);
    const formattedDate = transactionDate.toLocaleString('vi-VN', {dateStyle: 'medium', timeStyle: 'short'});
    return `
        <tr>
            <td>${item.sender}</td>
            <td>${item.recipient}</td>
            <td>${item.transactionAmount}</td>
            <td>${formattedDate}</td>
        </tr>
    `;
}

formCreate.validate({
    rules: {
        fullNameCreate: {
            required: true, minlength: 5, maxlength: 25
        }, emailCreate: {
            required: true, isEmail: true
        }, phoneCreate: {
            required: true, isNumberWithSpace: true
        }
    }, messages: {
        fullNameCreate: {
            required: 'Vui lòng nhập họ tên đầy đủ',
            minlength: 'Họ tên tối thiểu là 5 ký tự',
            maxlength: 'Họ tên tối đa là 25 ký tự'
        }, emailCreate: {
            required: 'Vui lòng nhập email đầy đủ',
        }, phoneCreate: {
            required: 'Vui lòng nhập phone đầy đủ'

        }
    }, submitHandler: function () {
        createCustomer();
    }
})
formUpdate.validate({
    rules: {
        fullNameUpdate: {
            required: true, minlength: 5, maxlength: 25
        }, emailUpdate: {
            required: true, isEmail: true
        }, phoneUpdate: {
            required: true, isNumberWithSpace: true
        }, addressUpdate: {
            required: true
        }
    }, messages: {
        fullNameUpdate: {
            required: 'Vui lòng nhập họ tên đầy đủ',
            minlength: 'Họ tên tối thiểu là 5 ký tự',
            maxlength: 'Họ tên tối đa là 25 ký tự'
        }, emailUpdate: {
            required: 'Vui lòng nhập email đầy đủ',
        }, phoneUpdate: {
            required: 'Vui lòng nhập phone đầy đủ'
        }, addressUpdate: {
            required: 'Vui lòng nhập địa chỉ đầy đủ'
        }
    }, submitHandler: function () {
        updateCustomer();
    }
})
formDeposit.validate({
    rules: {
        amountDeposit: {
            required: true, isNumber: true
        }
    }, messages: {
        amountDeposit: {
            required: 'Vui lòng nhập tiền giao dịch'
        }
    }, errorLabelContainer: "#modalDeposit .error-area", errorPlacement: function (error, element) {
        error.appendTo("#modalDeposit .error-area");
    }, showErrors: function (errorMap, errorList) {
        if (this.numberOfInvalids() > 0) {
            $("#modalDeposit .error-area").removeClass("hide").addClass("show");
        } else {
            $("#modalDeposit .error-area").removeClass("show").addClass("hide").empty();
            $("#formDes input.error").removeClass("error");
        }
        this.defaultShowErrors();
    }, submitHandler: function () {
        deposit();
    }
})
$.validator.addMethod("isEmail", function (value, element) {
    return this.optional(element) || /^[a-z]+@[a-z]+\.[a-z]+$/i.test(value);
}, "Vui lòng nhập đúng định dạng email");
$.validator.addMethod("isNumberWithSpace", function (value, element) {
    return this.optional(element) || /^[0][0-9]{9}$/i.test(value);
}, "Vui lòng nhập 10 số bắt đầu là 0");
$.validator.addMethod("isNumber", function (value, element) {
    return this.optional(element) || /^[0-9]*$/i.test(value);
}, "Vui lòng nhập tiền giao dịch bằng ký tự số");

const initializeControlEvent = () => {
    btnShowModalCreate.on('click', () => {
        modalCreate.modal('show');
        $('#searchInput').prop('readonly', true)
    })

    btnCreate.on('click', () => {
        formCreate.trigger('submit');
    })

    btnUpdate.on('click', () => {
        formUpdate.trigger('submit');
    })

    modalCreate.on('hide.bs.modal', () => {
        $('#searchInput').prop('readonly', false)
    })

    modalDeposit.on('hide.bs.modal', () => {
        $('.error-area').empty().addClass('hide');
    })

    btnDeposit.on('click', () => {
        formDeposit.trigger('submit');
    })

    modalWithdraw.on('hide.bs.modal', () => {
        $('.error-area').empty().addClass('hide');
    })

    btnWithdraw.on('click', () => {
        withdraw();
    })

    btnTransfer.on('click', () => {
        transfer();
    })


    btnHistory.on('click', () => {
        history();
        modalHistory.modal('show');
    })
}

$(() => {
    getAllCustomers();
    initializeControlEvent();
    deleteCustomer();
    showUpdate();
    showDeposit();
    showWithdraw();
    showTransfer();
    initializePage();
})
