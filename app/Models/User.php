<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasApiTokens, HasRoles;

    protected $fillable = [
        'uuid',
        'name',
        'email',
        'password',
        'avatar',
        'google_id',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ];

    protected $hidden = [
        'id',
        'password',
        'remember_token',
        'google_id',
        'roles',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });

        static::deleting(function ($model) {
            if ($model->isForceDeleting()) {
                return;
            }
            $model->email = "deleted_{$model->id}_{$model->email}";
            $model->saveQuietly();
        });
    }

    public function isReader(): bool
    {
        return $this->hasRole('reader');
    }

    public function isEditor(): bool
    {
        return $this->hasRole('editor');
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('superadmin');
    }

    public function canManageUsers(): bool
    {
        return $this->hasRole('superadmin');
    }

    public function canManagePosts(): bool
    {
        return $this->hasAnyRole(['editor', 'admin', 'superadmin']);
    }

    public function canApproveComments(): bool
    {
        return $this->hasAnyRole(['admin', 'superadmin']);
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
