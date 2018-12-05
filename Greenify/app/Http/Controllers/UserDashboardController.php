<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    function index()
    {
        $user = Auth::user()->load('profile');
        return  response()->json($user);
    }

    function update(Request $request, $id)
    {

    }
}
