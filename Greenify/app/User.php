<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $with = 'profile';


    function profile()
    {
        return $this->hasOne(Profile::class);
    }

    function role()
    {
        return $this->belongsTo(Role::class);
    }

    function reviews()
    {
        return $this->hasMany(Review::class);
    }

    function comments()
    {
        return $this->hasMany(Comment::class);
    }

}
