<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// TODO FIX VUE HISTORY MODE
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

/**
 * Test routes to check if everything is working
 */
Route::resource('companies','CompanyController')->only(['index','show']);
Route::resource('reviews','ReviewController')->only(['index','show']);
Route::resource('tags','TagController')->only(['index','show']);

Route::get('dashbooard','UserDashboardController@index');
Route::post('dashbooard','UserDashboardController@update');




