const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const isNameValid = name !== undefined;
    const isPageValid = readPage < pageCount || readPage === pageCount;

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

    if (!isNameValid) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (!isPageValid) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (isNameValid && isPageValid) {
        books.push(newBook);
        const isSuccess = books.filter((book) => book.id === id).length > 0;

        if (isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            return response;
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { reading, finished, name } = request.query;
    
    if (reading == 0) {
        const filterBooks = books.filter((book) => book.reading == false);
        const mappingBooks = filterBooks.map((book) => ({id: book.id, name: book.name, publisher: book.publisher }));
        const newBooks = ({books: mappingBooks});
        return ({status: 'success', data: newBooks });
    }

    if (reading == 1) {
        const filterBooks = books.filter((book) => book.reading == true);
        const mappingBooks = filterBooks.map((book) => ({id: book.id, name: book.name, publisher: book.publisher }));
        const newBooks = ({books: mappingBooks});

        return ({status: 'success', data: newBooks });
    }

    if (finished == 0) {
        const filterBooks = books.filter((book) => book.finished == false);
        const mappingBooks = filterBooks.map((book) => ({id: book.id, name: book.name, publisher: book.publisher }));
        const newBooks = ({books: mappingBooks});
        return ({status: 'success', data: newBooks });
    }

    if (finished == 1) {
        const filterBooks = books.filter((book) => book.finished == true);
        const mappingBooks = filterBooks.map((book) => ({id: book.id, name: book.name, publisher: book.publisher }));
        const newBooks = ({books: mappingBooks});

        return ({status: 'success', data: newBooks });
    }

    if (name !== undefined) {
        const filterBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        const mappingBooks = filterBooks.map((book) => ({id: book.id, name: book.name, publisher: book.publisher }));
        const newBooks = ({books: mappingBooks});

        return ({status: 'success', data: newBooks });
    }

    const mappingBooks = books.map((book) => ({id: book.id, name: book.name, publisher: book.publisher }));
    const newBooks = ({books: mappingBooks});

    return ({status: 'success', data: newBooks });
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: { book },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const isNameValid = name !== undefined;
    const isPageValid = readPage < pageCount || readPage === pageCount;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        if (!isNameValid) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        if (!isPageValid) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        if (isNameValid && isPageValid) {
            books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt };

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            });
    
            response.code(200);
            return response;
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};